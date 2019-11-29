<?php
require_once('../v1/common.php');

$dossier = 'uploads/';
$fichier = basename($_FILES['my_file']['name']);
$taille_maxi = 100000;
$taille = filesize($_FILES['my_file']['tmp_name']);
$extensions = array('.crd', '.yaml');
$extension = strrchr($_FILES['my_file']['name'], '.'); 
if(!in_array($extension, $extensions))
{
     send_status(400);
     send_error(70, 'Invalid file type', 'File type not in [.crd|.yaml]');
     exit();
}
if($taille>$taille_maxi)
{
     send_status(400);
     send_error(71, 'Invalid file size', 'File size greater than '.$taille_maxi);
     exit();
}
if(!isset($erreur)) //S'il n'y a pas d'erreur, on upload
{
     //On formate le nom du fichier ici...
     $fichier = strtr($fichier, 
          'ÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïðòóôõöùúûüýÿ', 
          'AAAAAACEEEEIIIIOOOOOUUUUYaaaaaaceeeeiiiioooooouuuuyy');
     $fichier = preg_replace('/([^.a-z0-9]+)/i', '-', $fichier);
     if(move_uploaded_file($_FILES['my_file']['tmp_name'], $dossier . $fichier)) //Si la fonction renvoie TRUE, c'est que ça a fonctionné...
     {
         send_status(201);
         send_error(73, 'Upload done', 'File '.$_FILES['my_file']['name'].' has been uploaded.');
         exit();
     }
     else //Sinon (la fonction renvoie FALSE).
     {
         send_status(500);
         send_error(72, 'Upload failed', 'Upload file '.$_FILES['my_file']['name'].' failed!');
         exit();
     }
}
?>