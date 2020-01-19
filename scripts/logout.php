<?php

  session_save_path('/home/users/web/b454/ipg.kborvonarl/sessions');
  session_start();
  session_unset();
  session_destroy();
  session_write_close();
  setcookie(session_name(),'',0,'/');
  session_regenerate_id(true);

?>
