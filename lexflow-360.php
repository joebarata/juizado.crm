<?php
/**
 * Plugin Name: LexFlow 360 - CRM Jurídico Inteligente
 * Description: Sistema de gestão jurídica 360. Solução de Alta Performance com Babel Engine.
 * Version: 5.4.1
 * Author: LexFlow Tech
 */

if ( ! defined( 'ABSPATH' ) ) exit;

class LexFlow360 {
    public function __construct() {
        add_action('admin_menu', array($this, 'create_settings_menu'));
        add_shortcode('lexflow_crm', array($this, 'render_crm'));
        add_action('wp_head', array($this, 'inject_header_dependencies'), 1);
        add_action('wp_footer', array($this, 'enqueue_entry_point'));
        add_action('template_redirect', array($this, 'handle_script_proxy'));
    }

    public function handle_script_proxy() {
        if (isset($_GET['lexflow_serve'])) {
            $file = sanitize_text_field($_GET['lexflow_serve']);
            $file = str_replace('../', '', $file);
            $path = plugin_dir_path(__FILE__) . $file;

            if (file_exists($path)) {
                header('Content-Type: application/javascript; charset=utf-8');
                header('Access-Control-Allow-Origin: *');
                header('Cache-Control: no-cache, must-revalidate');
                
                $content = file_get_contents($path);
                
                // Reescreve imports locais para passar pelo proxy PHP novamente
                $content = preg_replace('/from\s+[\'"]\.\/([^"\'\s]+)[\'"]/', 'from "./?lexflow_serve=$1"', $content);
                
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
            window.lexflowConfig = { apiKey: '<?php echo esc_js($api_key); ?>', ajaxUrl: '<?php echo admin_url('admin-ajax.php'); ?>' };
        </script>
        
        <script type="importmap">
        {
          "imports": {
            "react": "https://esm.sh/react@18.2.0",
            "react/": "https://esm.sh/react@18.2.0/",
            "react-dom": "https://esm.sh/react-dom@18.2.0",
            "react-dom/": "https://esm.sh/react-dom@18.2.0/",
            "react-dom/client": "https://esm.sh/react-dom@18.2.0/client",
            "@google/genai": "https://esm.sh/@google/genai@1.3.0",
            "recharts": "https://esm.sh/recharts@2.10.3?external=react,react-dom"
          }
        }
        </script>

        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
        <script src='https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js'></script>
        
        <style>
            .lexflow-wp-wrapper { all: unset; display: block; width: 100%; min-height: 100vh; background: #020617; color: white; font-family: 'Plus Jakarta Sans', sans-serif; position: relative; }
            #root:empty { min-height: 70vh; display: flex; align-items: center; justify-content: center; }
            #root:empty::after { content: "SINCRONIZANDO LEXFLOW..."; color: #2563eb; font-weight: 800; font-size: 10px; letter-spacing: 5px; animation: pulse 1.5s infinite; }
            @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        </style>
        <?php
    }

    public function enqueue_entry_point() {
        $url = add_query_arg('lexflow_serve', 'index.tsx', home_url('/'));
        echo '<script type="text/babel" data-type="module" data-presets="react,typescript" src="' . esc_url($url) . '"></script>';
    }

    public function render_crm() { return '<div id="root" class="lexflow-wp-wrapper"></div>'; }
    public function create_settings_menu() { add_menu_page('LexFlow 360', 'LexFlow 360', 'manage_options', 'lexflow-settings', array($this, 'settings_page_content'), 'dashicons-balance-scale', 25); }
    public function settings_page_content() {
        if (isset($_POST['save'])) { update_option('lexflow_api_key', sanitize_text_field($_POST['api_key'])); echo '<div class="updated"><p>Salvo com sucesso!</p></div>'; }
        $v = get_option('lexflow_api_key');
        echo '<div class="wrap"><h1>LexFlow Control Panel</h1><form method="post"><p>Insira sua Gemini API Key abaixo:</p><input type="password" name="api_key" value="'.esc_attr($v).'" class="regular-text" /><br><br><input type="submit" name="save" class="button button-primary" value="Salvar Configurações" /></form></div>';
    }
}
new LexFlow360();
