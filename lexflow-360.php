<?php
/**
 * Plugin Name: LexFlow 360 - CRM Jurídico Inteligente
 * Description: Sistema de gestão jurídica 360. Versão com Ponte de Módulos (Zero-Build).
 * Version: 5.2.0
 * Author: LexFlow Tech
 */

if ( ! defined( 'ABSPATH' ) ) exit;

class LexFlow360 {
    public function __construct() {
        add_action('admin_menu', array($this, 'create_settings_menu'));
        add_shortcode('lexflow_crm', array($this, 'render_crm'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_assets'));
        add_action('wp_head', array($this, 'inject_header_dependencies'), 1);
        // Intercepta arquivos .tsx antes do WordPress carregar o tema
        add_action('template_redirect', array($this, 'handle_script_proxy'));
    }

    public function handle_script_proxy() {
        if (isset($_GET['lexflow_serve'])) {
            $file = sanitize_text_field($_GET['lexflow_serve']);
            // Proteção contra Path Traversal
            $file = str_replace('../', '', $file);
            $path = plugin_dir_path(__FILE__) . $file;

            if (file_exists($path)) {
                header('Content-Type: application/javascript; charset=utf-8');
                header('X-Content-Type-Options: nosniff');
                header('Access-Control-Allow-Origin: *');
                
                $content = file_get_contents($path);
                
                // REESCRITA DE IMPORTS PARA O TÚNEL PHP
                // Transforma: import App from './App.tsx' 
                // Em: import App from './?lexflow_serve=App.tsx'
                $content = preg_replace('/from\s+[\'"](\.\/[^"\'\s]+)[\'"]/', 'from "$1?lexflow_serve=1"', $content);
                // Lida com imports de subpastas como ./components/File.tsx
                $content = preg_replace('/from\s+[\'"](\.\/[^"\'\s]+\.tsx)[\'"]/', 'from "?lexflow_serve=$1"', $content);
                
                echo $content;
                exit;
            }
        }
    }

    public function inject_header_dependencies() {
        $api_key = get_option('lexflow_api_key', '');
        ?>
        <script>
            window.process = { env: { API_KEY: '<?php echo esc_js($api_key); ?>', NODE_ENV: 'production' } };
            window.lexflowConfig = {
                apiKey: '<?php echo esc_js($api_key); ?>',
                ajaxUrl: '<?php echo admin_url('admin-ajax.php'); ?>'
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

        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
        <script src='https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js'></script>
        
        <style>
            .lexflow-wp-wrapper { all: unset; display: block; width: 100%; min-height: 100vh; background: #020617; color: white; font-family: 'Plus Jakarta Sans', sans-serif; }
            #root:empty { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #020617; position: fixed; inset: 0; z-index: 9999; }
            #root:empty::before { content: "\f24e"; font-family: "Font Awesome 6 Free"; font-weight: 900; font-size: 40px; color: #2563eb; margin-bottom: 20px; animation: spin 2s linear infinite; }
            #root:empty::after { content: "SINCRONIZANDO BANCO DE DADOS JURÍDICO..."; color: #2563eb; font-weight: 800; font-size: 10px; letter-spacing: 5px; }
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        </style>
        <?php
    }

    public function enqueue_assets() {
        $entry_url = add_query_arg('lexflow_serve', 'index.tsx', home_url('/'));
        // Forçamos o Babel a processar o arquivo como um módulo React TypeScript
        echo '<script type="text/babel" data-type="module" data-presets="react,typescript" src="' . esc_url($entry_url) . '"></script>';
    }

    public function render_crm() {
        return '<div id="root" class="lexflow-wp-wrapper"></div>';
    }

    public function create_settings_menu() {
        add_menu_page('LexFlow 360', 'LexFlow 360', 'manage_options', 'lexflow-settings', array($this, 'settings_page_content'), 'dashicons-balance-scale', 25);
    }

    public function settings_page_content() {
        if (isset($_POST['save'])) {
            update_option('lexflow_api_key', sanitize_text_field($_POST['api_key']));
            echo '<div class="updated"><p>Configurações atualizadas!</p></div>';
        }
        $val = get_option('lexflow_api_key');
        ?>
        <div class="wrap">
            <h1>LexFlow 360 Config</h1>
            <form method="post">
                <input type="password" name="api_key" value="<?php echo esc_attr($val); ?>" class="regular-text" placeholder="Gemini API Key" />
                <input type="submit" name="save" class="button button-primary" value="Salvar" />
            </form>
        </div>
        <?php
    }
}
new LexFlow360();
