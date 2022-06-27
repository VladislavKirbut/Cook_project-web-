<?php
//php не умеет работать с json, для этого мы его декодируем 
    $_POST = json_decode(file_get_contents("php://input"), true);
// var_dump() - позволит увидеть те данные, которые прийдут нам от пользователя(покажет тип, значение данных)
    echo var_dump($_POST);
