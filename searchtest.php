<?php
// Minimize caching so admin area always displays latest statistics
// header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
// header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
// header("Cache-Control: no-store, no-cache, must-revalidate");
// header("Cache-Control: post-check=0, pre-check=0", false);
// header("Pragma: no-cache");
include 'dbconnectpdo.php';
$searchErr = '';
$employee_details='';
// USE test;
if(isset($_POST['save']))
{
    if(!empty($_POST['search']))
    {
        $search = $_POST['search'];
        $stmt = $conn->prepare("select email, skills, bio from mentorUsers where skills like '%$search%'");
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
<!-- <style>

</style> -->
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
    background: rgb(6,0,108);
    background: linear-gradient(91deg, rgba(6,0,108,1) 0%, rgba(9,9,121,1) 25%, rgba(0,146,175,1) 92%);
    padding: 10pt;
    color: #ffffff;
    border-radius: 15px 0 15px 0;
}
#div1{

}
h3{
    color: #ffffff;
    font-size: 20pt;
    font-weight: bold;
    text-align: left;
}
h2{
    color: #ffffff;
    font-size: 16pt;
    font-weight: bold;
    text-align: left;
}
tr{
    color: #ffffff;
    font-size: 15pt;
    font-weight: bold;
    text-align: left;
    background-color : #090979;
}
td{
    color: #ffffff;
    font-size: 15pt;
    font-weight: bold;
    text-align: left;
    padding: auto;
    background-color : #090979;
}
/* thread{
    color: #ffffff;
    font-size: 15pt;
    font-weight: bold;
    text-align: left;
    background-color : grey;
} */

</style>
</head>
 
<body>
    <div class="div1">
    <div class="container">
    <h3><u>Search for Skills and Display Results</u></h3>
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
    <h2><u>Available Mentors in Your Org:</u></h2><br/>
    <div class="table-responsive">          
      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Employee Email</th>
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
</div>
<script src="jquery-3.2.1.min.js"></script>
</body>
</html>
