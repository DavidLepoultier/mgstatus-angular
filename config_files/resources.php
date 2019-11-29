<?php
require_once('common.php');

define('DATAFILE', '../resources/resources.dat');

// Return an elem with given id and name
/*function elem($id, $name)
{
        return array('id' => $id, 'name' => $name);
}*/

// Look for given id in resources array
function find_id($resources, $id)
{
	for ($i = 0; $i < count($resources); $i++)
	{
		if ($resources[$i]['id'] == $id)
			return $i;
	}

	return -1;
}

function find_container($resources, $id, $container)
{
	for ($i = 0; $i < count($resources[$id]['containers']); $i++)
	{
		if ($resources[$id]['containers'][$i]['id'] == $container)
			return $i;
	}
	return -1;
}


// Load data from body
function read_body_resource()
{
	$body = file_get_contents('php://input');
	$id = 0;
	if ($body != '')
	{
		// Read given name
		$resource = json_decode($body, true);

		if (is_null($resource))
		{
			send_status(400);
			send_error(22, 'Invalid body', 'Invalid json in posted body');
			exit();
		}

		$elem = array();
		if (isset($resource['id']))
			$elem['id'] = $resource['id'];
		if (isset($resource['org']))
			$elem['org'] = $resource['org'];
		if (isset($resource['env']))
			$elem['env'] = $resource['env'];
		if (isset($resource['containers']))
			$elem['containers'] = $resource['containers'];
		if (isset($resource['describe']))
			$elem['describe'] = $resource['describe'];

		return $elem;
	}

	return null;
}

// Read data from file
function read_data()
{
	$resources = array();

	$fp = fopen(DATAFILE, "r");
	if (!$fp)
		return $resources;

	if (flock($fp, LOCK_SH))
	{
		if (filesize(DATAFILE) > 0)
			$resources = unserialize(fread($fp, filesize(DATAFILE)));
		flock($fp, LOCK_UN);
	}

	fclose($fp);
	return $resources;
}

// Write data to file
function write_data($resources)
{
	$fp = fopen(DATAFILE, "w");
	if (!$fp)
		return false;

	$ok = 0;
	if (flock($fp, LOCK_EX))
	{
		ftruncate($fp, 0);
		fwrite($fp, serialize($resources));
		fflush($fp);
		flock($fp, LOCK_UN);
		$ok = 1;
	}

	fclose($fp);
	return ($ok == 1);
}

// Call to GET /resources returns all items
function get_all()
{
	send_status(200);
	send_json('resources', read_data());
	exit();
}

// Call to GET /resources/{id} returns the required item (or 404 if it does not exist)
function get($id)
{
	$resources = read_data();
	$i = find_id($resources, $id);
	if ($i == -1)
	{
		send_status(404);
		send_error(60, 'Resource not found', 'Object id #'.$id.' not found');
		exit();
	}

	send_status(200);
	send_json('resource', $resources[$i]);
	exit();
}

// Call to GET /resources/{id} returns the required item (or 404 if it does not exist)
function get_container($id, $container)
{
	$resources = read_data();
	$i = find_id($resources, $id);
	if ($i == -1)
	{
		send_status(404);
		send_error(60, 'Resource not found', 'Object id #'.$id.' not found');
		exit();
	}
	$c = find_container($resources, $i, $container);
	if ($c == -1)
	{
		send_status(404);
		send_error(61, 'Resource not found', 'Object container #'.$container.' not found');
		exit();
	}

	send_status(200);
	send_json('resource', $resources[$i]['containers'][$c]);
	exit();
}

// Call to POST /resoures create a new item with given name if one
function post()
{
	// Read resources
	$resources = read_data();
	// Read body if one
	$postresource = read_body_resource();
	$id = is_null($postresource) ? '' : array_get($postresource, 'id');
	$container = is_null($postresource) ? '' : array_get($postresource, 'containers');

	// Create new id and store new resource
  $i = find_id($resources, $id);
	if ($i == -1)
	{
	  $resources[] = $postresource;
		write_data($resources);

		// Return answer
		send_status(201);
		//send_header('Location', $_SERVER['REQUEST_URI'].'/'.$id);
		exit();
	}

	$resources[$i]['describe'] = $postresource['describe'];
	write_data($resources);

  $c = find_container($resources, $i, $container[0]['id']);
	if ($c != -1)
	{
		$resources[$i]['containers'][$c] = $postresource['containers'][0];
		write_data($resources);

		// Return answer
		send_status(201);
		//send_header('Location', $_SERVER['REQUEST_URI'].'/'.$id);
    exit();
	} else {
    $resources[$i]['containers'][] = $postresource['containers'][0];
		write_data($resources);

		// Return answer
		send_status(201);
		//send_header('Location', $_SERVER['REQUEST_URI'].'/'.$id);
    exit();
	}
	send_status(403);
	send_error(60, 'Resource found', 'Object id #'.$id.' already exist');
	exit();
}

// Call to PUT /resources/{id}/{container} update name of given resource
function putContainer($id, $container)
{
	// Read body
	$postresource = read_body_resource();
	if (is_null($postresource))
	{
		send_status(400);
		send_error(21, 'Missing body');
		exit();
	}
	if (!isset($postresource['id']))
	{
		send_status(400);
		send_error(23, 'Missing body field', 'Missing ID field in body');
		exit();
	}
	if (!isset($postresource['containers']))
	{
		send_status(400);
		send_error(23, 'Missing body field', 'Missing containers field in body');
		exit();
	}
	if ($id != $postresource['id'])
	{
		send_status(400);
		send_error(24, 'Invalid body field', 'ID in body ('.$postresource['id'].') does not match ID in URL ('.$id.')');
		exit();
	}

	// Update name
	$resources = read_data();
	$i = find_id($resources, $id);
	if ($i == -1)
	{
		send_status(404);
		send_error(60, 'Resource not found', 'Object id #'.$id.' not found');
		exit();
	}
	$c = find_container($resources, $i, $container);
	if ($c == -1)
	{
		send_status(404);
		send_error(61, 'Resource not found', 'Object container #'.$container.' not found');
		exit();
	}

	$resources[$i]['containers'][$c] = $postresource['containers'][0];
	write_data($resources);

	send_status(200);
	send_header('Content-Location', $_SERVER['REQUEST_URI']);
	send_json('resource', $resources[$i]);
	exit();
}

function del_all()
{
	$resources = array();
	write_data($resources);

	send_status(204);
	exit();
}

function del($id)
{
	$resources = read_data();
	$i = find_id($resources, $id);
	if ($i == -1)
	{
		send_status(404);
		send_error(60, 'Resource not found', 'Object id #'.$id.' not found');
		exit();
	}

	array_splice($resources, $i, 1);
	write_data($resources);

	send_status(204);
	exit();
}

// Change ID of an item (forbidden if destination ID already exists)
function moveid(&$resources, $oldid, $newid)
{
	// Check new ID value
	if (!is_numeric($newid))
	{
		send_status(400);
		send_error(24, 'Invalid body field', 'Given ID "'.$newid.'" in body is not numeric');
		exit();
	}

	$newid = intval($newid);
	if ($newid <= 0)
	{
		send_status(400);
		send_error(24, 'Invalid body field', 'Bad given ID "'.$newid.'" in body');
		exit();
	}

	// Check non-existence of target ID
	$i = find_id($resources, $newid);
	if ($i != -1)
	{
		send_status(400);
		send_error(24, 'Invalid body field', 'Resource with ID #'.$newid.' already exists');
		exit();
	}

	// Replace ID
	$i = find_id($resources, $oldid);
	if ($i == -1)
	{
		send_status(404);
		send_error(60, 'Resource not found', 'Given URL ID #'.$oldid.' not found');
		exit();
	}
	$resources[$i]['id'] = $newid;
}

function patch($id)
{
	// Read body
	$postresource = read_body_resource();
	if (is_null($postresource))
	{
		send_status(400);
		send_error(21, 'Missing body');
		exit();
	}

	// Update name
	$resources = read_data();
	$i = find_id($resources, $id);
	if ($i == -1)
	{
		send_status(404);
		send_error(60, 'Resource not found', 'Object id #'.$id.' not found');
		exit();
	}

	if (isset($postresource['name']))
		$resources[$i]['name'] = $postresource['name'];

	// Body contains a new ID
	$newid = -1;
	if (isset($postresource['id']) && ($id != $postresource['id']))
	{
		moveid($resources, $id, $postresource['id']);
		$newid = $postresource['id'];
	}

	write_data($resources);

	// Response
	send_status(200);
	if ($newid == -1)
		send_header('Content-Location', $_SERVER['REQUEST_URI']);
	else
	{
		// ID has changed: set the new URL in Content-Location
		$newuri = substr($_SERVER['REQUEST_URI'], 0, strrpos($_SERVER['REQUEST_URI'], '/') + 1).$newid;
		send_header('Content-Location', $newuri);
	}
	send_json('resource', $resources[$i]);
	exit();
}


// ---------------------

$method = $_SERVER['REQUEST_METHOD'];
$id = array_get($_GET, 'id');
$containers = array_get($_GET, 'containers');

if ($id == '')
{
	// Request /resources

	if ($method == 'GET')
		get_all();
	if ($method == 'POST')
		post();
	if ($method == 'DELETE')
		del_all();

	send_status(405);
	send_header('Allow', 'GET, POST, DELETE');
	send_error(61, 'Method not allowed');
} elseif ($containers != '') {
	if ($method == 'GET')
		get_container($id, $containers);
	if ($method == 'PUT')
		putContainer($id, $containers);
	if ($method == 'DELETE')
		delContainer($id, $containers);
	if ($method == 'PATCH')
		patchContainer($id, $containers);

	send_status(405);
	send_header('Allow', 'GET, PUT, DELETE, PATCH');
	send_error(61, 'Method not allowed');
} else {
	// Request /resources/{id}
	if ($method == 'GET')
		get($id);
	if ($method == 'DELETE')
		del($id);

	send_status(405);
	send_header('Allow', 'GET, DELETE');
	send_error(61, 'Method not allowed');
}

?>