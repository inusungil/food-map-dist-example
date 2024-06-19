const { pool } = require("../../config/database");

exports.selectRestaurants = async function(connection, category){
  const selectAllRestaurantsQuery=`SELECT title, address, category , videoUrl FROM Restaurants where status ='A';`;
  const selectCategoriedRestaurantsQuery=`SELECT title, address, category , videoUrl FROM Restaurants where status ='A' and category = ?;`;

 // const Query = `update Students set status ="D" where studentIdx = ? ;`;
 const Query = category ?  selectCategoriedRestaurantsQuery : selectAllRestaurantsQuery ;
 const Params = [category];

  const rows = await connection.query(Query, Params); //  rows  맞음 updateStudents
  
  return rows;
};

// 로그인 (회원검증)
exports.isValidUsers = async function (connection, userID, password) {
  const Query = `SELECT userIdx, nickname FROM Users where userID = ? and password = ? and status = 'A';`;
  const Params = [userID, password];

  const rows = await connection.query(Query, Params);

  return rows;
};

// 회원가입
exports.insertUsers = async function (connection, userID, password, nickname) {
  const Query = `insert into Users(userID, password, nickname) values (?,?,?);`;
  const Params = [userID, password, nickname];

  const rows = await connection.query(Query, Params);

  return rows;
};

exports.deleteStudent = async function(connection,studentIdx){
  const Query = `update Students set status ="D" where studentIdx = ? ;`;
  const Params = [studentIdx];

  const rows = await connection.query(Query, Params); //  rows  맞음 updateStudents
  
  return rows;
};

exports.updateStudents = async function (
  connection,
  studentIdx,
  studentName, 
  major, 
  birth, 
  address
) {
 
  const Query = `update Students set studentName = ifnull(?,studentName), major= ifnull(?,major), birth = ifnull(?,birth) , address = ifnull(?,address) WHERE studentIdx = ?;`;
  const Params = [studentName, major, birth, address, studentIdx];

  const rows = await connection.query(Query, Params); //  rows  맞음 updateStudents
  
  return rows;
};

exports.isValidStudentIdx = async function (connection,studentIdx) {
  const Query = `SELECT * FROM Students WHERE studentIdx = ? and status ="A" ;`;
  const Params = [studentIdx];

  const [rows] = await connection.query(Query, Params); // #####  [rows] 가 강의중 rows 나감
 // console.log(rows);    // 디버기용
  if(rows <1){
    return false;
  }
  return true;
};

exports.insertStudents = async function (connection,studentName, major, birth, address) {
  const Query = `insert into Students (studentName, major, birth, address) values(?,?,?,?);`;
  const Params = [studentName, major, birth, address];

  const rows = await connection.query(Query, Params);

  return rows;
};

exports.selectStudents = async function (connection,studentIdx) {
  //const selectAllStudentsQuery = `SELECT * FROM Students;`;
  const Query = `SELECT * FROM Students where studentIdx = ?;`;
  const Params = [studentIdx];

  
  //let Query = studentName ? selectStudentByNameQuery :selectAllStudentsQuery;

  /*if(!studentName){
    Query = selectAllStudentsQuery;
  } else{
    Query = selectStudentByNameQuery;
  }*/

  const rows = await connection.query(Query, Params);

  return rows;
};

exports.exampleDao = async function (connection) {
  const Query = `SELECT * FROM Students;`;
  const Params = [];

  const rows = await connection.query(Query, Params);

  return rows;
};


