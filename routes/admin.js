const express = require('express');
const fs = require('fs');
const exe = require('../configure/conn');

const router = express.Router();

router.get('/',async (req, res) => {
  var sql = `SELECT * FROM sliders`;
  var sliderslist = await exe(sql);
  var packet = { sliderslist };
  res.render("layout" , packet);
});

router.post("/save-slider",async (req, res) => {
  if(req.files.slider_image){
    var filename = Date.now() + "-" + req.files.slider_image.name;
    req.files.slider_image.mv("public/uploads/" + filename);
  }
  else{
    var filename = "default.jpg";
  }
  var data = req.body;
  var sql = `INSERT INTO sliders (slider_image) VALUES (?)`;
  await exe(sql, [
    filename
  ])
  res.redirect("/");
});

router.get("/edit-slider/:slider_id",async (req, res) => {
  var slider_id = req.params.slider_id;
  var sql = `SELECT * FROM sliders WHERE slider_id = ?`;
  var slidersone = await exe(sql, [slider_id]);
  var packet = { slidersone };
  res.render("edit-slider" , packet);
});

router.post("/update-slider", async (req, res) => {

  var slider_id = req.body.slider_id;

  var old = await exe("SELECT slider_image FROM sliders WHERE slider_id = ?", [slider_id]);

  if (req.files && req.files.slider_image) {

    if (old.length && old[0].slider_image !== "default.jpg") {
      fs.unlinkSync("public/uploads/" + old[0].slider_image);
    }

    var filename = Date.now() + "-" + req.files.slider_image.name;
    req.files.slider_image.mv("public/uploads/" + filename);
  } else {
    var filename = old[0].slider_image;
  }

  await exe("UPDATE sliders SET slider_image = ? WHERE slider_id = ?", [
    filename,
    slider_id
  ]);

  res.redirect("/");
});

router.get("/delete-slider/:slider_id",async (req, res) => {

  var slider_id = req.params.slider_id;

  var sqlOld = `SELECT * FROM sliders WHERE slider_id = ?`;
  var oldName = await exe(sqlOld, [slider_id]);

  if(oldName[0].slider_image != "default.jpg"){
    fs.unlinkSync("public/uploads/" + oldName[0].slider_image);
  }

  var sql = `DELETE FROM sliders WHERE slider_id = ?`;
  await exe(sql, [slider_id]);
  res.redirect("/");
});

router.get("/slider-api",async (req, res) => {
  var sql = `SELECT * FROM sliders`;
  var sliderslist = await exe(sql);
  res.json(sliderslist);
});

//-------------------------------------------------------------------------------------------------------------------------------------------

router.get('/courses',async (req, res) => {
  var sql = `SELECT * FROM courses`;
  var courseslist = await exe(sql);
  var packet = { courseslist };
  res.render("courses" , packet);
});

router.post("/save-courses",async (req, res) => {
  if(req.files.courses_photo){
    var filename = Date.now() + "-" + req.files.courses_photo.name;
    req.files.courses_photo.mv("public/uploads/" + filename);
  }
  else{
    var filename = "default.jpg";
  }

  var data = req.body;
  var sql = `INSERT INTO courses (courses_name,courses_photo,courses_trainner,courses_language,courses_duration,courses_price) VALUES (?,?,?,?,?,?)`;
  await exe(sql, [
    data.courses_name,
    filename,
    data.courses_trainner,
    data.courses_language,
    data.courses_duration,
    data.courses_price
  ])
  res.redirect("/courses");
});

router.get("/edit-course/:courses_id",async (req, res) => {
  var courses_id = req.params.courses_id;
  var sql = `SELECT * FROM courses WHERE courses_id = ?`;
  var coursesone = await exe(sql, [courses_id]);
  var packet = { coursesone };
  res.render("edit-courses" , packet);
});

router.post("/update-courses",async (req, res) => {
  var data = req.body;
  var sql = `UPDATE courses SET courses_name=?,courses_trainner=?,courses_language=?,courses_duration=?,courses_price=? WHERE courses_id=?`;
  await exe(sql, [
    data.courses_name,
    data.courses_trainner,
    data.courses_language,
    data.courses_duration,
    data.courses_price,
    data.courses_id
  ])

  if(req.files){
    var filename = Date.now() + "-" + req.files.courses_photo.name;
    req.files.courses_photo.mv("public/uploads/" + filename);
    var sql = `UPDATE courses SET courses_photo=? WHERE courses_id=?`;
    await exe(sql, [filename, data.courses_id]);
  }

  res.redirect("/courses");
});

router.get("/delete-course/:courses_id",async (req, res) => {

  var courses_id = req.params.courses_id;

  var sqlGet = `SELECT courses_photo FROM courses WHERE courses_id = ?`;
  var PhotoData = await exe(sqlGet, [courses_id]);

  if(PhotoData.length && PhotoData[0].courses_photo){
  var filePath = "public/uploads/" + PhotoData[0].courses_photo;
  fs.unlink(filePath, () => {});
  }
  
  var sql = `DELETE FROM courses WHERE courses_id = ?`;
  await exe(sql, [courses_id]);
  res.redirect("/courses");
});

router.get("/courses-api",async (req, res) => {
  var sql = `SELECT * FROM courses`;
  var courseslist = await exe(sql);
  res.json(courseslist);
});

// ---------------------------------------------------------------------------------------------------------------------------------------------

router.get("/about-us",async (req, res) => {
  var sql = `SELECT * FROM about_us`;
  var aboutlist = await exe(sql);
  var packet = { aboutlist };
  res.render("about-us" , packet);
});

router.post("/save-about-us",async (req, res) => {
  if(req.files){
    var filename = Date.now() + "-" + req.files.about_image.name;
    req.files.about_image.mv("public/uploads/" + filename);
  }
  else{
    var filename = "default.jpg";
  }

  var data = req.body;
  var sql = `INSERT INTO about_us (about_image,about_title,about_description) VALUES (?,?,?)`;
  await exe(sql, [
    filename,
    data.about_title,
    data.about_description
  ])
  res.redirect("/about-us");
});

router.get("/edit-about-us/:about_id",async (req, res) => {
  var about_id = req.params.about_id;
  var sql = `SELECT * FROM about_us WHERE about_id = ?`;
  var aboutone = await exe(sql, [about_id]);
  var packet = { aboutone };
  res.render("edit-about-us" , packet);
});

router.post("/update-about-us",async (req,res) => {
  var data = req.body;
  var sql = `UPDATE about_us SET about_title = ?, about_description = ? WHERE about_id = ?`;
  await exe(sql, [
    data.about_title,
    data.about_description,
    data.about_id
  ]);

  if(req.files && req.files.about_image){

    var sqlOld = `SELECT about_image FROM about_us WHERE about_id = ?`;
    var oldPhoto = await exe(sqlOld,[data.about_id]);
    var oldName = (Array.isArray(oldPhoto) && oldPhoto.length) ? oldPhoto[0].about_image : null ;

    var filename = Date.now() + "-" + req.files.about_image.name;
    req.files.about_image.mv("public/uploads/" + filename);
    var sqlImg = `UPDATE about_us SET about_image=? WHERE about_id=?`;
    await exe(sqlImg, [filename, data.about_id]);

    if(oldName && oldName !== filename){
      var filePath = "public/uploads/" + oldName;
      fs.unlink(filePath, () => {});
    }
  }

  res.redirect("/about-us");
});

router.get("/about-us-api",async (req, res) => {
  var sql = `SELECT * FROM about_us`;
  var aboutlist = await exe(sql);
  res.json(aboutlist);
});

// --------------------------------------------------------------------------------------------------------------------------------------------

router.get("/result",async (req,res) => {
  var sql = `SELECT * FROM results`;
  var results = await exe(sql);
  var packet = { results };
  res.render("result" , packet);  
});

router.post("/save-result",async (req,res) => {

  if(req.files){
    var filename = Date.now() + "-" + req.files.result_image.name;
    req.files.result_image.mv("public/uploads/" + filename);
  }
  else{
    var filename = "default.jpg";
  }
  var data = req.body;
  var sql = `INSERT INTO results (result_name, result_rank_title, result_image, result_category) VALUES (?, ?, ?, ?)`;
  await exe(sql, [
    data.result_name,
    data.result_rank_title,
    filename,
    data.result_category
  ]);
  res.redirect("/result");
});

router.get("/edit-result/:result_id",async (req, res) => {
  var result_id = req.params.result_id;
  var sql = `SELECT * FROM results WHERE result_id = ?`;
  var resultone = await exe(sql, [result_id]);
  var packet = { resultone };
  res.render("edit-result" , packet);
});

router.post("/update-result",async (req,res) => {

  var data = req.body;
  var sql = `UPDATE results SET result_name = ?, result_rank_title = ?, result_category = ? WHERE result_id = ?`;
  await exe(sql, [
    data.result_name,
    data.result_rank_title,
    data.result_category,
    data.result_id

  ]);

  if(req.files && req.files.result_image){

    var sqlOld = `SELECT result_image FROM results WHERE result_id = ?`;
    var oldPhoto = await exe(sqlOld,[data.result_id]);
    var oldName = (Array.isArray(oldPhoto) && oldPhoto.length) ? oldPhoto[0].result_image : null ;

    var filename = Date.now() + "-" + req.files.result_image.name;
    req.files.result_image.mv("public/uploads/" + filename);
    var sqlImg = `UPDATE results SET result_image=? WHERE result_id=?`;
    await exe(sqlImg, [filename, data.result_id]);

    if(oldName && oldName !== filename){
      var filePath = "public/uploads/" + oldName;
      fs.unlink(filePath, () => {});
    }
  }

  res.redirect("/result");
});

router.get("/delete-result/:result_id",async (req, res) => {

  var result_id = req.params.result_id;
  var sqlOld = `SELECT result_image FROM results WHERE result_id = ?`;
  var oldPhoto = await exe(sqlOld,[result_id]);
  var oldName = (Array.isArray(oldPhoto) && oldPhoto.length) ? oldPhoto[0].result_image : null ;
  if(oldName){
    var filePath = "public/uploads/" + oldName;
    fs.unlink(filePath, () => {});
  }
  var sql = `DELETE FROM results WHERE result_id = ?`;
  await exe(sql, [result_id]);
  res.redirect("/result");
});

router.get("/result-api",async (req, res) => {
  var sql = `SELECT * FROM results`;
  var results = await exe(sql);
  res.json(results);
});

//-------------------------------------------------------------------------------------------------------------------------------------

router.get("/testimonials",async (req,res) => {
  var sql = `SELECT * FROM testimonials`;
  var testimonials = await exe(sql);
  var packet = { testimonials };
  res.render("testimonials" , packet);  
});

router.post("/save-testimonial", async (req, res) => {

  let data = req.body;
  let files = req.files;
  let filename = "";

  if (data.tm_type === "video") {
    data.tm_video = (data.tm_video || "")
      .replace("watch?v=", "embed/")
      .replace("youtu.be/", "www.youtube.com/embed/");
    data.tm_name = "";
    data.tm_text = "";
  }

  if (data.tm_type === "testimonial") {
    data.tm_video = "";
  }

  if (files && files.tm_image) {
    filename = Date.now() + "-" + files.tm_image.name;
    await files.tm_image.mv("public/uploads/" + filename);
  }

  var sql = `INSERT INTO testimonials (tm_type, tm_video, tm_name, tm_text, tm_image) VALUES (?, ?, ?, ?, ?)`;
  await exe(
    sql,[
      data.tm_type,
      data.tm_video,
      data.tm_name,
      data.tm_text,
      filename ? "uploads/" + filename : data.tm_image,
    ]);

  res.redirect("/testimonials");
});

router.get("/edit-testimonial/:tm_id",async (req, res) => {
  var tm_id = req.params.tm_id;
  var sql = `SELECT * FROM testimonials WHERE tm_id = ?`;
  var testimonialone = await exe(sql, [tm_id]);
  var packet = { testimonialone };
  res.render("edit-testimonial" , packet);
});


router.post("/update-testimonial", async (req, res) => {
  let data = req.body;
  let files = req.files;
  let filename = "";

  if (data.tm_type === "video") {
    data.tm_video = (data.tm_video || "")
      .replace("watch?v=", "embed/")
      .replace("youtu.be/", "www.youtube.com/embed/");
    data.tm_name = "";
    data.tm_text = "";
  }

  if(data.tm_type == "testimonial"){
    data.tm_video = "";
  }
  if (files && files.tm_image) {
    filename = Date.now() + "-" + files.tm_image.name;
    await files.tm_image.mv("public/uploads/" + filename);
  }

  var sqlOld = `SELECT tm_image FROM testimonials WHERE tm_id = ?`;
  var oldPhoto = await exe(sqlOld,[data.tm_id]);
  var oldName = (Array.isArray(oldPhoto) && oldPhoto.length) ? oldPhoto[0].tm_image : null ;
  if(oldName && oldName !== filename){
    var filePath = "public/uploads/" + oldName;
    fs.unlink(filePath, () => {});
  }
  
  var sql = `UPDATE testimonials SET tm_type = ?, tm_video = ?, tm_name = ?, tm_text = ?, tm_image = ? WHERE tm_id = ?`;
  await exe(
    sql, [
      data.tm_type,
      data.tm_video,
      data.tm_name,
      data.tm_text,
      filename ? "uploads/" + filename : data.tm_image,
      data.tm_id
    ]);

  res.redirect("/testimonials");
});

router.get("/delete-testimonial/:tm_id",async (req, res) => {

  var tm_id = req.params.tm_id;
  var sqlOld = `SELECT tm_image FROM testimonials WHERE tm_id = ?`;
  var oldPhoto = await exe(sqlOld,[tm_id]);
  var oldName = (Array.isArray(oldPhoto) && oldPhoto.length) ? oldPhoto[0].tm_image : null ;
  if(oldName){
    var filePath = "public/uploads/" + oldName;
    fs.unlink(filePath, () => {});
  }
  var sql = `DELETE FROM testimonials WHERE tm_id = ?`;
  await exe(sql, [tm_id]);
  res.redirect("/testimonials");
});

router.get("/testimonial-api",async (req, res) => {
  var sql = `SELECT * FROM testimonials`;
  var testimonials = await exe(sql);
  res.json(testimonials);
});

//------------------------------------------------------------------------------------------------------------------------------------------

router.get("/timetable",async (req, res) => {
  var sql = `SELECT * FROM subjects`;
  var subjects = await exe(sql);
  var packet = { subjects };
  res.render("timetable" , packet);  
});

router.post("/save-subjects", async (req, res) => {
  let data = req.body;
  let files = req.files;
  let filename = "";

  if (files && files.subject_image) {
    filename = Date.now() + "-" + files.subject_image.name;
    await files.subject_image.mv("public/uploads/" + filename);
  }

  var sql = `INSERT INTO subjects (subject_name, subject_description, subject_image) VALUES (?, ?, ?)`;
  await exe(
    sql, [
      data.subject_name,
      data.subject_description,
      filename ? "uploads/" + filename : data.subject_image,
    ]);

  res.redirect("/timetable");
});

router.get("/edit-subject/:subject_id", async (req, res) => {
  var subject_id = req.params.subject_id;
  var sql = `SELECT * FROM subjects WHERE subject_id = ?`;
  var subjectone = await exe(sql, [subject_id]);
  var packet = { subjectone };
  res.render("edit-subject" , packet);
});

router.post("/update-subject", async (req, res) => {
  let data = req.body;
  let files = req.files;
  let filename = "";

  if (files && files.subject_image) {
    filename = Date.now() + "-" + files.subject_image.name;
    await files.subject_image.mv("public/uploads/" + filename);
  }

  var sqlOld = `SELECT subject_image FROM subjects WHERE subject_id = ?`;
  var oldPhoto = await exe(sqlOld, [data.subject_id]);
  var oldName = (Array.isArray(oldPhoto) && oldPhoto.length) ? oldPhoto[0].subject_image : "";

  if (filename && oldName && oldName !== "uploads/" + filename) {
    var filePath = "public/" + oldName;
    fs.unlink(filePath, () => {});
  }

  var sql = `UPDATE subjects SET subject_name = ?, subject_description = ?, subject_image = ? WHERE subject_id = ?`;
  await exe(
    sql,
    [
      data.subject_name,
      data.subject_description,
      filename ? "uploads/" + filename : oldName,
      data.subject_id
    ]
  );

  res.redirect("/timetable");
});


router.get("/delete-subject/:subject_id",async (req, res) => {

  var subject_id = req.params.subject_id;
  var sqlOld = `SELECT subject_image FROM subjects WHERE subject_id = ?`;
  var oldPhoto = await exe(sqlOld,[subject_id]);
  var oldName = (Array.isArray(oldPhoto) && oldPhoto.length) ? oldPhoto[0].subject_image : null ;
  if(oldName){
    var filePath = "public/uploads/" + oldName; 
    fs.unlink(filePath, () => {});
  }
  var sql = `DELETE FROM subjects WHERE subject_id = ?`;
  await exe(sql, [subject_id]);
  res.redirect("/timetable");
});

router.get("/subject-api",async (req, res) => {
  var sql = `SELECT * FROM subjects`;
  var subjects = await exe(sql);
  res.json(subjects);
});

//---------------------------------------------------------------------------------------------------------------------------------------

router.get("/why-choose-us", async (req, res) => {
  var sql = `SELECT * FROM whychooseus`;
  var whychooseuslist = await exe(sql);
  var packet = { whychooseuslist };
  res.render("why-choose-us" , packet);
});

router.post("/save-why-choose-us", async (req, res) => {
  let data = req.body;
  let files = req.files;
  let filename = "";
  
  if (files && files.wcu_image) {
    filename = Date.now() + "-" + files.wcu_image.name;
    await files.wcu_image.mv("public/uploads/" + filename);
  }

  var sql = `INSERT INTO whychooseus (wcu_title, wcu_image) VALUES (?, ?)`;
  await exe(
    sql, [
      data.wcu_title,
      filename ? "uploads/" + filename : data.wcu_image,
    ]);

  res.redirect("/why-choose-us");
});

router.get("/edit-why-choose-us/:wcu_id", async (req, res) => {
  var wcu_id = req.params.wcu_id;
  var sql = `SELECT * FROM whychooseus WHERE wcu_id = ?`;
  var whychooseusone = await exe(sql, [wcu_id]);
  var packet = { whychooseusone };
  res.render("edit-why-choose-us" , packet);
});

router.post("/update-why-choose-us", async (req, res) => {
  let data = req.body;
  let files = req.files;
  let filename = "";
  if (files && files.wcu_image) {
    filename = Date.now() + "-" + files.wcu_image.name;
    await files.wcu_image.mv("public/uploads/" + filename);
  }
  

  var sqlOld = `SELECT wcu_image FROM whychooseus WHERE wcu_id = ?`;
  var oldPhoto = await exe(sqlOld, [data.wcu_id]);
  var oldName = (Array.isArray(oldPhoto) && oldPhoto.length) ? oldPhoto[0].wcu_image : "";

  if (filename && oldName && oldName !== "uploads/" + filename) {
    var filePath = "public/" + oldName;
    fs.unlink(filePath, () => {});
  }

  var sql = `UPDATE whychooseus SET wcu_title = ?, wcu_image = ? WHERE wcu_id = ?`;
  await exe(
    sql,
    [
      data.wcu_title,
      filename ? "uploads/" + filename : oldName,
      data.wcu_id
    ]
  );

  res.redirect("/why-choose-us");
});

router.get("/delete-why-choose-us/:wcu_id",async (req, res) => {

  var wcu_id = req.params.wcu_id;
  var sqlOld = `SELECT wcu_image FROM whychooseus WHERE wcu_id = ?`;
  var oldPhoto = await exe(sqlOld,[wcu_id]);
  var oldName = (Array.isArray(oldPhoto) && oldPhoto.length) ? oldPhoto[0].wcu_image : null ;
  if(oldName){
    var filePath = "public/" + oldName; 
    fs.unlink(filePath, () => {});
  }
  var sql = `DELETE FROM whychooseus WHERE wcu_id = ?`;
  await exe(sql, [wcu_id]);
  res.redirect("/why-choose-us");
});

router.get("/why-choose-us-api",async (req, res) => {
  var sql = `SELECT * FROM whychooseus`;
  var whychooseuslist = await exe(sql);
  res.json(whychooseuslist);
});



module.exports = router;
