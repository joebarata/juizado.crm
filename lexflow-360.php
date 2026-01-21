<?php
/**
 * Plugin Name: LexFlow 360 - CRM Jurídico Inteligente
 * Description: Sistema de gestão jurídica 360 com IA e Integração PJE para WordPress.
 * Version: 4.0.0
 * Author: LexFlow Tech
 */

if ( ! defined( 'ABSPATH' ) ) exit;

class LexFlow360 {
    public function __construct() {
        add_shortcode('lexflow_crm', array($this, 'render_crm'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_assets'));
        add_action('admin_menu', array($this, 'create_settings_menu'));
    }

    public function create_settings_menu() {
        add_menu_page(
            'LexFlow Settings',
            'LexFlow 360',
            'manage_options',
            'lexflow-settings',
            array($this, 'settings_page_content'),
            'dashicons-balance-scale'
        );
    }

    public function settings_page_content() {
        ?>
        <div class="wrap">
            <h1>Configurações LexFlow 360</h1>
            <form method="post" action="options.php">
                <?php wp_nonce_field('update-options'); ?>
                <table class="form-table">
                    <tr valign="top">
                        <th scope="row">Gemini API Key</th>
                        <td><input type="text" name="lexflow_api_key" value="<?php echo esc_attr(get_option('lexflow_api_key')); ?>" class="regular-text" /></td>
                    </tr>
                </table>
                <input type="hidden" name="action" value="update" />
                <input type="hidden" name="page_options" value="lexflow_api_key" />
                <p class="submit"><input type="submit" class="button-primary" value="Salvar Configurações" /></p>
            </form>
            <p>Use o shortcode <code>[lexflow_crm]</code> em qualquer página para exibir o sistema.</p>
        </div>
        <?php
    }

    public function enqueue_assets() {
        // Apenas carrega os scripts se o shortcode estiver presente na página
        global $post;
        if ( has_shortcode( $post->post_content, 'lexflow_crm' ) ) {
            // Em um ambiente real, carregaríamos o build do React. 
            // Para este protótipo, injetamos a chave da API via localização de script.
            wp_localize_script('jquery', 'lexflowConfig', array(
                'apiKey' => get_option('lexflow_api_key'),
                'rootUrl' => plugin_dir_url(__FILE__)
            ));
        }
    }

    public function render_crm() {
        // Container onde o React será montado
        return '<div id="root" class="lexflow-wp-wrapper"></div>';
    }
}

new LexFlow360();
