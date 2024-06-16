const { pool } = require("../../config/database");
const { logger } = require("../../config/winston");
const jwt = require("jsonwebtoken");
const secret = require("../../config/secret");
const indexDao = require("../dao/indexDao");

// 식당조회
exports.readRestaurants = async function (req, res) {
  const { category} =req.query;

  // 카테고리 값이 넘어 왔다면, 유효한 값인지 체크
  if(category){
    const validCategory =[
      "한식",
      "중식",
      "일식",
      "양식",
      "분식",
      "구이",
      "회/초밥",
      "기타",

    ];       // js 배열요소 포함 여부   arr.includes(valueToFind[, fromIndex])
    if(!validCategory.includes(category)){
      
      return res.send({
        isSuccess: false,
        code: 400,           // 요청 성공시 200번대 , 실패시 400번대 코드
        message: "유효한 카테고리가 아닙니다.",
      });
    };
    
  };
  
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      const [rows] = await indexDao.selectRestaurants(connection,category);      //es6 비구조 할당

      return res.send({
        result: rows,
        isSuccess: true,
        code: 200,           // 요청 성공시 200번대 , 실패시 400번대 코드
        message: "식당 목록 요청 성공",
      });
    } catch (err) {
      logger.error(`readRestaurants Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`readRestaurants DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
};


// #########################  학생 삭제  ################################
exports.deleteStudent = async function (req, res) {
  const {studentIdx}= req.params;

  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      // ######      studentIdx 유효성검사

      const isValidStudentIdx = await indexDao.isValidStudentIdx(
        connection,
        studentIdx
      );
      // console.log(isValidStudentIdx+"            1");
      if(!isValidStudentIdx){
        return res.send({
          isSuccess: false,
          code: 410,           // 요청 성공시 200번대 , 실패시 400번대 코드
          message: "유효한  학생인덱스가 아닙니다.",
        });
      }

      // #########  학생 삭제 
      const [rows] = await indexDao.deleteStudent(connection, studentIdx);      //es6 비구조 할당

      return res.send({
        isSuccess: true,
        code: 200,           // 요청 성공시 200번대 , 실패시 400번대 코드
        message: "학생 삭제 성공"
      });
    } catch (err) {
      logger.error(`deleteStudnet Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`deleteStudnet DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
};

// #########################  학생 업데이트  ################################
exports.updateStudent = async function(req, res){
  const {studentName, major, birth, address} =req.body;
  const {studentIdx}= req.params;

  if(studentName && typeof studentName !=="string"){
    return res.send({
      isSuccess: false,
      code: 400,           // 요청 성공시 200번대 , 실패시 400번대 코드
      message: "값을 정확히 입력해 주세요",
    });
  }

  if(major && typeof major !=="string"){
    return res.send({
      isSuccess: false,
      code: 400,           // 요청 성공시 200번대 , 실패시 400번대 코드
      message: "값을 정확히 입력해 주세요",
    });
  }
    if(address && typeof address !=="string"){
    return res.send({
      isSuccess: false,
      code: 400,           // 요청 성공시 200번대 , 실패시 400번대 코드
      message: "값을 정확히 입력해 주세요",
    });
  }

  // birth : YYYY-MM-DD 형식검사    구글  js 날짜형식 검사
  var regex= RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);
  //console.log(regex.test("2022-09-31"));
  if(birth && !regex.test(birth)){
    return res.send({
      isSuccess: false,
      code: 400,           // 요청 성공시 200번대 , 실패시 400번대 코드
      message: "날짜형식을 확인해 주세요",
    });
  }

  // return;    // 중간에서 멈추도록 잠시 테스트용 설정   디버깅용

  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      // ######      studentIdx 유효성검사

      const isValidStudentIdx = await indexDao.isValidStudentIdx(connection,studentIdx) ;
      // console.log(isValidStudentIdx+"            1");
      if(!isValidStudentIdx){
        return res.send({
          isSuccess: false,
          code: 410,           // 요청 성공시 200번대 , 실패시 400번대 코드
          message: "유효한  학생인덱스가 아닙니다.",
        });
      }
      //######      studentIdx 유효성검사    끝

      // console.log(1);  //  디버깅용
      

      //######     학생 업데이트 
      const [rows] = await indexDao.updateStudents(
        connection,studentIdx,studentName, major, birth, address) ; //es6 비구조 할당

      return res.send({
        isSuccess: true,
        code: 200,           // 요청 성공시 200번대 , 실패시 400번대 코드
        message: "학생 수정 성공",
      });
    } catch (err) {
      logger.error(`updateStudent Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`updateStudent DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
};


// #############################    학생 생성   ##################################
exports.createStudent = async function(req, res){
  const {studentName, major, birth, address} =req.body;
  //console.log(studentName, major, birth, address);
  
  // studentName , major, address : 문자열
  if(
    typeof studentName !=="string" ||
    typeof major !=="string" ||
    typeof address !=="string"
  ){
    return res.send({
      isSuccess: false,
      code: 400,           // 요청 성공시 200번대 , 실패시 400번대 코드
      message: "값을 정확히 입력해 주세요",
    });
  }
  // birth : YYYY-MM-DD 형식검사    구글  js 날짜형식 검사
  var regex= RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);
  //console.log(regex.test("2022-09-31"));
  if(!regex.test(birth)){
    return res.send({
      isSuccess: false,
      code: 400,           // 요청 성공시 200번대 , 실패시 400번대 코드
      message: "날짜형식을 확인해 주세요",
    });
  }

  //생성
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      const [rows] = await indexDao.insertStudents(
        connection,studentName, major, birth, address) ; //es6 비구조 할당

      return res.send({
        isSuccess: true,
        code: 200,           // 요청 성공시 200번대 , 실패시 400번대 코드
        message: "학생 생성 성공",
      });
    } catch (err) {
      logger.error(`createStudent Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`createStudent DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
};


// ########################   학생테이블 조회   #########################
exports.readStudents = async function (req, res){
  const {studentIdx} = req.params;    //비구조할당
  //const studentName = req.query.studentName;
  
  //  console.log(studentName);

  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      const [rows] = await indexDao.selectStudents(connection,studentIdx);      //es6 비구조 할당

      return res.send({
        result: rows,
        isSuccess: true,
        code: 200,           // 요청 성공시 200번대 , 실패시 400번대 코드
        message: "조회 요청 성공",
      });
    } catch (err) {
      logger.error(`readStudents Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`readStudents DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
};


// ##################            예시 코드   ########################
exports.example = async function (req, res) {
  //return res.send("get dummy 요청성공");

  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      const [rows] = await indexDao.exampleDao(connection);      //es6 비구조 할당

      return res.send({
        result: rows,
        isSuccess: true,
        code: 200,           // 요청 성공시 200번대 , 실패시 400번대 코드
        message: "요청 성공",
      });
    } catch (err) {
      logger.error(`example Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`example DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
};