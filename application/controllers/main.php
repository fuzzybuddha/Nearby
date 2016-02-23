<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Main extends CI_Controller {

	public function __construct(){
		parent::__construct();
		//$this->output->enable_profiler();
	}

	public function index()
	{

		$this->load->view('index');
	}

	public function facebook_login()
	{

		$this->load->model('login');
		$user = array(
				'first_name' => $this->input->post('first_name'),
				'last_name' => $this->input->post('last_name'),
				'clientID' => $this->input->post('clientID'),
				'accessToken' => $this->input->post('accessToken'),
				'email' => $this->input->post('email')
		);
		$add_user = $this->login->add_facebook_user($user);
		$this->session->set_userdata($user);
	}


}
