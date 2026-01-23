<?php
/**
 * Plugin Name: LexFlow 360 - CRM Jurídico Inteligente
 * Description: Sistema de gestão jurídica 360 de Alta Performance.
 * Version: 5.7.0
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

    private function get_safe_base_url() {
        $url = home_url('/');
        if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https') {
            $url = str_replace('http://', 'https://', $url);
        }
        return $url;
    }

    public function handle_script_proxy() {
        if (isset($_GET[$this->token])) {
            $file_name = sanitize_text_field($_GET[$this->token]);
            $plugin_path = plugin_dir_path(__FILE__);
            $target = $plugin_path . str_replace(['../', '..\\'], '', $file_name);

            if (file_exists($target)) {
                header('Content-Type: application/javascript; charset=utf-8');
                header('X-Content-Type-Options: nosniff');
                header('Access-Control-Allow-Origin: *');
                header('Cache-Control: no-cache, no-store, must-revalidate');
                readfile($target);
                exit;
            }
            header("HTTP/1.0 404 Not Found");
            exit;
        }
    }

    public function inject_header_dependencies() {
        $api_key = get_option('lexflow_api_key', '');
        // Proxy base aponta para o index do site com a flag do motor
        $proxy_url = add_query_arg($this->token, '', $this->get_safe_base_url());
        ?>
        <script>
            window.process = { env: { API_KEY: '<?php echo esc_js($api_key); ?>', NODE_ENV: 'production' } };
            window.lexflowConfig = { 
                apiKey: '<?php echo esc_js($api_key); ?>', 
                proxyUrl: '<?php echo esc_js($proxy_url); ?>' 
            };
        </script>
        
        <script type="importmap">
        {
          "imports": {
            "react": "https://esm.sh/react@18.2.0",
            "react-dom": "https://esm.sh/react-dom@18.2.0",
            "react-dom/client": "https://esm.sh/react-dom@18.2.0/client",
            "@google/genai": "https://esm.sh/@google/genai@1.3.0",
            "recharts": "https://esm.sh/recharts@2.10.3?external=react,react-dom",
            "./": "<?php echo esc_js($proxy_url); ?>"
          }
        }
        </script>

        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
        <script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.js"></script>
        
        <style>
            .lexflow-wp-container #root:empty { min-height: 500px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #020617; border-radius: 32px; border: 1px solid rgba(255,255,255,0.05); }
            .lexflow-wp-container #root:empty::after { content: "CONECTANDO AO LEXFLOW 360..."; color: #2563eb; font-weight: 900; font-size: 11px; letter-spacing: 3px; animation: lx-pulse 1s infinite; }
            @keyframes lx-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
        </style>
        <?php
    }

    public function enqueue_entry_point() {
        // Força o carregamento do index.tsx SEMPRE via proxy para garantir o MIME type JS
        $entry_url = add_query_arg($this->token, 'index.tsx', $this->get_safe_base_url());
        echo '<script type="text/babel" data-type="module" data-presets="react,typescript" src="' . esc_url($entry_url) . '"></script>';
    }

    public function render_crm() { 
        return '<div class="lexflow-wp-container" style="all: initial;"><div id="root"></div></div>'; 
    }

    public function create_settings_menu() { 
        add_menu_page('LexFlow 360', 'LexFlow 360', 'manage_options', 'lexflow-settings', array($this, 'settings_page_content'), 'dashicons-balance-scale', 25); 
    }

    public function settings_page_content() {
        if (isset($_POST['save'])) { update_option('lexflow_api_key', sanitize_text_field($_POST['api_key'])); echo '<div class="updated"><p>Salvo!</p></div>'; }
        $v = get_option('lexflow_api_key');
        echo '<div class="wrap"><h1>Configurações LexFlow</h1><form method="post"><input type="password" name="api_key" value="'.esc_attr($v).'" class="regular-text" /><br><br><input type="submit" name="save" class="button-primary" value="Salvar" /></form></div>';
    }
}
new LexFlow360();
