<?php
//Minimize caching so admin area always displays latest statistics
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
include 'dbconnectpdo.php';
$searchErr = '';
$employee_details='';
// USE test;
if(isset($_POST['save']))
{
    if(!empty($_POST['search']))
    {
        $search = $_POST['search'];
        $stmt = $conn->prepare("select * from mentorUsers where skills like '%$search%'");
        $stmt->execute();
        $employee_details = $stmt->fetchAll(PDO::FETCH_ASSOC);
        //print_r($employee_details);
         
    }
    else
    {
        $searchErr = "Please enter skill to search";
    }
    
}
 
?>
<html>
<head>
<meta http-equiv="Cache-control" content="no-cache">
<title>Skill Search</title>
<style>
<?php include './style.css'; ?>
</style>
<link rel="stylesheet" href="style.css">
<style>
.container{
    width:70%;
    height:30%;
    padding:40px;
}
body{
  float: left;
    margin: 10px;
    background-color: rgba(50, 116, 214, .8);
    padding: 10pt;
    color: #ffffff;
    border-radius: 15px 0 15px 0;
}
h3{
    color: #ffffff;
    font-size: 20pt;
    font-weight: bold;
    text-align: center;
}
</style>
</head>
 
<body>
    <div class="container">
    <h3><u>Search Database for Skills and Display Results</u></h3>
    <br/><br/>
    <form class="form-horizontal" action="#" method="post">
    <div class="row">
        <div class="form-group">
            <label class="control-label col-sm-4" for="email"><b>Search Employee Skills:</b></label>
            <div class="col-sm-4">
              <input type="text" class="form-control" name="search" placeholder="search here">
            </div>
            <div class="col-sm-2">
              <button type="submit" name="save" class="btn btn-success btn-sm">Submit</button>
            </div>
        </div>
        <div class="form-group">
            <span class="error" style="color:red;">* <?php echo $searchErr;?></span>
        </div>
         
    </div>
    </form>
    <br/><br/>
    <h3><u>Search Result</u></h3><br/>
    <div class="table-responsive">          
      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Employee Email</th>
            <!-- <th>Phone No</th> -->
            <th>Skills</th>
            <th>Bio</th>
          </tr>
        </thead>
        <tbody>
                <?php
                 if(!$employee_details)
                 {
                    echo '<tr>No data found</tr>';
                 }
                 else{
                    foreach($employee_details as $key=>$value)
                    {
                        ?>
                    <tr>
                        <td><?php echo $key+1;?></td>
                        <td><?php echo $value['email'];?></td>
                        <td><?php echo $value['skills'];?></td>
                        <td><?php echo $value['bio'];?></td>
                    </tr>
                         
                        <?php
                    }
                     
                 }
                ?>
             
         </tbody>
      </table>
    </div>
</div>
<script src="jquery-3.2.1.min.js"></script>
<script src="bootstrap.min.js"></script>
</body>
</html>
