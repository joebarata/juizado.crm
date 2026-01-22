<?php
/**
 * Plugin Name: LexFlow 360 - CRM Jurídico Inteligente
 * Description: Sistema de gestão jurídica 360 com IA Gemini. Solução definitiva para erro de MIME type em Hostinger/Shared Hosting.
 * Version: 4.8.0
 * Author: LexFlow Tech
 * Text Domain: lexflow-360
 */

if ( ! defined( 'ABSPATH' ) ) exit;

class LexFlow360 {
    
    public function __construct() {
        add_action('admin_menu', array($this, 'create_settings_menu'));
        add_shortcode('lexflow_crm', array($this, 'render_crm'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_assets'));
        add_action('wp_head', array($this, 'inject_header_dependencies'), 1);
        
        // O "Túnel" de MIME Type: Captura requisições via URL
        add_action('init', array($this, 'handle_script_proxy'));
        
        add_action('wp_ajax_lexflow_save_data', array($this, 'ajax_save_data'));
        add_action('wp_ajax_lexflow_get_data', array($this, 'ajax_get_data'));
    }

    /**
     * Esta função é o segredo para funcionar na Hostinger.
     * Ela intercepta a chamada do script e diz ao navegador: "Isto é JavaScript!"
     */
    public function handle_script_proxy() {
        if (isset($_GET['lexflow_serve_file'])) {
            $file = sanitize_text_field($_GET['lexflow_serve_file']);
            $path = plugin_dir_path(__FILE__) . $file;

            if (file_exists($path) && (strpos($file, '.tsx') !== false || strpos($file, '.ts') !== false)) {
                header('Content-Type: application/javascript; charset=utf-8');
                header('X-Content-Type-Options: nosniff');
                header('Access-Control-Allow-Origin: *');
                
                $content = file_get_contents($path);
                
                // Reescreve os imports internos para que eles também passem pelo Túnel PHP
                // Exemplo: transformamos [import App from './App.tsx'] em [import App from '?lexflow_serve_file=App.tsx']
                $content = preg_replace('/from\s+[\'"]\.\/([^"\'\s]+)[\'"]/', 'from "./?lexflow_serve_file=$1"', $content);
                
                echo $content;
                exit;
            }
        }
    }

    public function create_settings_menu() {
        add_menu_page('LexFlow 360', 'LexFlow 360', 'manage_options', 'lexflow-settings', array($this, 'settings_page_content'), 'dashicons-balance-scale', 25);
    }

    public function inject_header_dependencies() {
        $api_key = get_option('lexflow_api_key', '');
        ?>
        <script>
            window.process = { env: { API_KEY: '<?php echo esc_js($api_key); ?>', NODE_ENV: 'production' } };
            window.lexflowConfig = {
                apiKey: '<?php echo esc_js($api_key); ?>',
                ajaxUrl: '<?php echo admin_url('admin-ajax.php'); ?>',
                nonce: '<?php echo wp_create_nonce('lexflow_nonce'); ?>'
            };
        </script>
        
        <script type="importmap">
        {
          "imports": {
            "react": "https://esm.sh/react@18.2.0",
            "react-dom": "https://esm.sh/react-dom@18.2.0",
            "react-dom/client": "https://esm.sh/react-dom@18.2.0/client",
            "@google/genai": "https://esm.sh/@google/genai@1.3.0",
            "recharts": "https://esm.sh/recharts@2.10.3"
          }
        }
        </script>

        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
        <script src='https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js'></script>
        
        <style>
            .lexflow-wp-wrapper { all: unset; display: block; width: 100%; min-height: 100vh; background: #020617; color: white; font-family: 'Plus Jakarta Sans', sans-serif; }
            #root:empty { min-height: 600px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #020617; gap: 20px; }
            #root:empty::before { content: "\f24e"; font-family: "Font Awesome 6 Free"; font-weight: 900; font-size: 40px; color: #2563eb; animation: lexflow_pulse 2s infinite; }
            #root:empty::after { content: "ESTABELECENDO CONEXÃO SEGURA..."; color: #2563eb; font-weight: 800; font-size: 11px; text-transform: uppercase; letter-spacing: 4px; }
            @keyframes lexflow_pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.1); } }
            #root { position: relative; z-index: 9999; min-height: 100vh; }
        </style>
        <?php
    }

    public function enqueue_assets() {
        if ( is_singular() || is_admin() ) {
            // Em vez de carregar o arquivo .tsx direto, carregamos via nosso Proxy PHP
            $proxy_url = add_query_arg('lexflow_serve_file', 'index.tsx', home_url('/'));
            
            wp_enqueue_script('lexflow-main', $proxy_url, array(), time(), true);
            
            add_filter('script_loader_tag', function($tag, $handle, $src) {
                if ('lexflow-main' !== $handle) return $tag;
                // Força o tipo como module para o navegador processar os imports
                return '<script type="module" src="' . esc_url($src) . '"></script>';
            }, 10, 3);
        }
    }

    public function render_crm() {
        return '<div id="root" class="lexflow-wp-wrapper"></div>';
    }

    public function settings_page_content() {
        if (isset($_POST['lexflow_save_settings'])) {
            check_admin_referer('lexflow_save_action', 'lexflow_nonce_field');
            update_option('lexflow_api_key', sanitize_text_field($_POST['lexflow_api_key']));
            echo '<div class="updated"><p>Configurações salvas!</p></div>';
        }
        $api_key = get_option('lexflow_api_key');
        ?>
        <div class="wrap"><h1 style="font-weight: 900;">LexFlow 360 Setup</h1><form method="post" action=""><?php wp_nonce_field('lexflow_save_action', 'lexflow_nonce_field'); ?><table class="form-table"><tr><th scope="row">Gemini API Key</th><td><input type="password" name="lexflow_api_key" value="<?php echo esc_attr($api_key); ?>" class="regular-text" /></td></tr></table><p class="submit"><input type="submit" name="lexflow_save_settings" class="button button-primary" value="Salvar e Ativar" /></p></form></div>
        <?php
    }

    public function ajax_save_data() { check_ajax_referer('lexflow_nonce', 'nonce'); update_option("lexflow_data_".sanitize_text_field($_POST['dataType']), json_decode(stripslashes($_POST['payload']), true)); wp_send_json_success(); }
    public function ajax_get_data() { check_ajax_referer('lexflow_nonce', 'nonce'); wp_send_json_success(get_option("lexflow_data_".sanitize_text_field($_GET['dataType']), array())); }
}
new LexFlow360();
