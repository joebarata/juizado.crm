<?php
/**
 * Plugin Name: LexFlow 360 - CRM Jurídico Inteligente
 * Description: Sistema de gestão jurídica 360 de Alta Performance.
 * Version: 5.5.0
 * Author: LexFlow Tech
 */

if ( ! defined( 'ABSPATH' ) ) exit;

class LexFlow360 {
    private $token = 'lexflow_v5_engine';

    public function __construct() {
        add_action('admin_menu', array($this, 'create_settings_menu'));
        add_shortcode('lexflow_crm', array($this, 'render_crm'));
        add_action('wp_head', array($this, 'inject_header_dependencies'), 1);
        add_action('wp_footer', array($this, 'enqueue_entry_point'), 999);
        add_action('init', array($this, 'handle_script_proxy'));
    }

    /**
     * Proxy Robusto para Scripts TSX
     * Resolve o erro de MIME Type e caminhos relativos no WordPress
     */
    public function handle_script_proxy() {
        if (isset($_GET[$this->token])) {
            $raw_path = sanitize_text_field($_GET[$this->token]);
            
            // Segurança: impede subida de diretórios
            $clean_path = str_replace(array('../', '..\\'), '', $raw_path);
            $plugin_path = plugin_dir_path(__FILE__);
            
            // Tenta localizar o arquivo de forma absoluta no diretório do plugin
            $target = $plugin_path . $clean_path;

            if (file_exists($target) && (str_ends_with($target, '.tsx') || str_ends_with($target, '.ts'))) {
                header('Content-Type: application/javascript; charset=utf-8');
                header('X-Content-Type-Options: nosniff');
                header('Access-Control-Allow-Origin: *');
                header('Cache-Control: no-cache, no-store, must-revalidate');
                
                // Lê o arquivo e garante que importações internas também usem o proxy
                $content = file_get_contents($target);
                echo $content;
                exit;
            }
            
            header("HTTP/1.0 404 Not Found");
            echo "// LexFlow Engine Error: File not found -> " . esc_js($clean_path);
            exit;
        }
    }

    public function inject_header_dependencies() {
        $api_key = get_option('lexflow_api_key', '');
        // Gera a URL base do proxy. O segredo é o trailing slash no importmap.
        $proxy_base = add_query_arg($this->token, '', home_url('/'));
        ?>
        <script>
            window.process = { env: { API_KEY: '<?php echo esc_js($api_key); ?>', NODE_ENV: 'production' } };
            window.lexflowConfig = { 
                apiKey: '<?php echo esc_js($api_key); ?>',
                proxyUrl: '<?php echo esc_js($proxy_base); ?>'
            };
            console.log("LexFlow 360: Motor pronto. Proxy:", window.lexflowConfig.proxyUrl);
        </script>
        
        <script type="importmap">
        {
          "imports": {
            "react": "https://esm.sh/react@18.2.0",
            "react-dom": "https://esm.sh/react-dom@18.2.0",
            "react-dom/client": "https://esm.sh/react-dom@18.2.0/client",
            "@google/genai": "https://esm.sh/@google/genai@1.3.0",
            "recharts": "https://esm.sh/recharts@2.10.3?external=react,react-dom",
            "./": "<?php echo esc_js($proxy_base); ?>"
          }
        }
        </script>

        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.js"></script>
        
        <style>
            .lexflow-wp-container #root:empty { 
                min-height: 450px; 
                display: flex; 
                flex-direction: column;
                align-items: center; 
                justify-content: center; 
                background: #020617; 
                border-radius: 24px;
                color: #2563eb;
                font-family: 'Plus Jakarta Sans', sans-serif;
                margin: 20px 0;
            }
            .lexflow-wp-container #root:empty::before {
                content: "\f24e";
                font-family: "Font Awesome 6 Free";
                font-weight: 900;
                font-size: 40px;
                margin-bottom: 20px;
                animation: lx-spin 2s linear infinite;
            }
            .lexflow-wp-container #root:empty::after { 
                content: "SINCRONIZANDO LEXFLOW 360..."; 
                font-weight: 800; 
                font-size: 10px; 
                letter-spacing: 4px; 
            }
            @keyframes lx-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        </style>
        <?php
    }

    public function enqueue_entry_point() {
        // Injeta o index.tsx via Babel como um módulo
        $entry_url = add_query_arg($this->token, 'index.tsx', home_url('/'));
        echo '<script type="text/babel" data-type="module" data-presets="react,typescript" src="' . esc_url($entry_url) . '"></script>';
    }

    public function render_crm() { 
        return '<div class="lexflow-wp-container"><div id="root"></div></div>'; 
    }

    public function create_settings_menu() { 
        add_menu_page('LexFlow 360', 'LexFlow 360', 'manage_options', 'lexflow-settings', array($this, 'settings_page_content'), 'dashicons-balance-scale', 25); 
    }

    public function settings_page_content() {
        if (isset($_POST['save'])) { 
            update_option('lexflow_api_key', sanitize_text_field($_POST['api_key'])); 
            echo '<div class="updated"><p>Chave Gemini API salva com sucesso!</p></div>'; 
        }
        $v = get_option('lexflow_api_key');
        echo '<div class="wrap"><h1>Configurações LexFlow 360</h1><form method="post"><p>Sua API Key do Google Gemini:</p><input type="password" name="api_key" value="'.esc_attr($v).'" class="regular-text" /><br><br><input type="submit" name="save" class="button button-primary" value="Salvar Configurações" /></form></div>';
    }
}
new LexFlow360();
