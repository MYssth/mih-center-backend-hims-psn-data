require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
var config = require("./dbconfig");
const sql = require("mssql");

async function psnSpcClr(rData) {
  if (rData.length) {
    for (let i = 0; i < rData.length; i += 1) {
      await Object.assign(rData[i], {
        psn_id: rData[i].psn_id.split(" ").join(""),
        pname: rData[i].pname.split(" ").join(""),
        fname: rData[i].fname.split(" ").join(""),
        lname: rData[i].lname.split(" ").join(""),
        bdate: rData[i].bdate.split(" ").join(""),
        fld_id: rData[i].fld_id?.split(" ").join(""),
        fld_name: rData[i].fld_name?.split(" ").join(""),
        fac_id:
          rData[i].fld_id?.split(" ").join("") +
          "" +
          rData[i].fac_id.split(" ").join(""),
        fac_name: rData[i].fac_name?.split(" ").join(""),
        dept_id:
          rData[i].fld_id?.split(" ").join("") +
          "" +
          rData[i].fac_id.split(" ").join("") +
          "" +
          rData[i].dept_id.split(" ").join(""),
        dept_name: rData[i].dept_name?.split(" ").join(""),
        pos_id: rData[i].pos_id?.split(" ").join(""),
        pos_name: rData[i].pos_name?.split(" ").join(""),
        quit_date: rData[i].quit_date?.split(" ").join(""),
      });
    }
  } else {
    await Object.assign(rData, {
      psn_id: rData.psn_id.split(" ").join(""),
      pname: rData.pname.split(" ").join(""),
      fname: rData.fname.split(" ").join(""),
      lname: rData.lname.split(" ").join(""),
      bdate: rData.bdate.split(" ").join(""),
      fld_id: rData.fld_id?.split(" ").join(""),
      fld_name: rData.fld_name?.split(" ").join(""),
      fac_id:
        rData.fld_id?.split(" ").join("") +
        "" +
        rData.fac_id.split(" ").join(""),
      fac_name: rData.fac_name?.split(" ").join(""),
      dept_id:
        rData.fld_id?.split(" ").join("") +
        "" +
        rData.fac_id.split(" ").join("") +
        "" +
        rData.dept_id.split(" ").join(""),
      dept_name: rData.dept_name?.split(" ").join(""),
      pos_id: rData.pos_id?.split(" ").join(""),
      pos_name: rData.pos_name?.split(" ").join(""),
      quit_date: rData.quit_date?.split(" ").join(""),
    });
  }
  return rData;
}

const psnQryTxt =
  "SELECT" +
  " STFNO AS psn_id" +
  ", PRENAM AS pname" +
  ", NAM AS fname" +
  ", SURNAM AS lname" +
  ", HBD as bdate" +
  ", VIEW_STFMAS.รหัสสายงาน AS fld_id" +
  ", VIEW_DEPT.ชื่อสายงาน AS fld_name" +
  ", VIEW_STFMAS.รหัสฝ่ายงาน AS fac_id" +
  ", VIEW_DEPT.ชื่อฝ่ายงาน AS fac_name" +
  ", VIEW_STFMAS.รหัสหน่วยงาน AS dept_id" +
  ", VIEW_DEPT.ชื่อหน่วยงาน AS dept_name" +
  ", VIEW_STFMAS.รหัสตำแหน่ง AS pos_id" +
  ", VIEW_JOB_POSITION.ชื่อตำแหน่ง AS pos_name" +
  ", VIEW_STFMAS.วันที่ลาออก AS quit_date" +
  " FROM VIEW_STFMAS" +
  " LEFT JOIN VIEW_DEPT" +
  " ON ( VIEW_DEPT.รหัสสายงาน = VIEW_STFMAS.รหัสสายงาน AND VIEW_DEPT.รหัสฝ่ายงาน = VIEW_STFMAS.รหัสฝ่ายงาน AND VIEW_DEPT.รหัสหน่วยงาน = VIEW_STFMAS.รหัสหน่วยงาน )" +
  " LEFT JOIN VIEW_JOB_POSITION" +
  " ON VIEW_JOB_POSITION.รหัสตำแหน่ง = VIEW_STFMAS.รหัสตำแหน่ง" +
  " WHERE ( VIEW_STFMAS.รหัสสายงาน <> '' AND VIEW_STFMAS.รหัสฝ่ายงาน <> '' AND VIEW_STFMAS.รหัสหน่วยงาน <> '' ) ";

async function getAllPSN() {
  try {
    console.log("getAllPSN call try connect to server");
    let pool = await sql.connect(config);
    console.log("connect complete");
    const queryData = await pool.request().query(psnQryTxt);
    let result = queryData.recordsets[0];
    if (result) {
      result = await psnSpcClr(queryData.recordsets[0]);
    }
    console.log("getAllPSN complete");
    console.log("====================");
    return result;
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }
}

async function getActvPSN() {
  try {
    console.log("getActvPSN call try connect to server");
    let pool = await sql.connect(config);
    console.log("connect complete");
    const queryData = await pool
      .request()
      .query(psnQryTxt + "AND VIEW_STFMAS.วันที่ลาออก = '00000'");
    let result = queryData.recordsets[0];
    if (result) {
      result = await psnSpcClr(queryData.recordsets[0]);
    }
    console.log("getActvPSN complete");
    console.log("====================");
    return result;
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }
}

async function getPSNDataById(STFNO) {
  try {
    console.log("getPSNDataById call try connect to server");
    let pool = await sql.connect(config);
    console.log("connect complete");
    const queryData = await pool
      .request()
      .input("STFNO", sql.VarChar, STFNO)
      .query(psnQryTxt + "AND STFNO = @STFNO");
    let result = queryData.recordset[0];
    if (result) {
      result = await psnSpcClr(queryData.recordset[0]);
    } else {
      result = {};
    }
    console.log("getPSNDataById complete");
    console.log("====================");
    return result;
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }
}

async function deptSpcClr(rData) {
  if (rData.length) {
    for (let i = 0; i < rData.length; i += 1) {
      await Object.assign(rData[i], {
        fld_id: rData[i].fld_id.split(" ").join(""),
        fld_name: rData[i].fld_name.split(" ").join(""),
        fac_id:
          rData[i].fld_id.split(" ").join("") +
          "" +
          rData[i].fac_id.split(" ").join(""),
        fac_name: rData[i].fac_name.split(" ").join(""),
        dept_id:
          rData[i].fld_id.split(" ").join("") +
          "" +
          rData[i].fac_id.split(" ").join("") +
          "" +
          rData[i].dept_id.split(" ").join(""),
        dept_name: rData[i].dept_name.split(" ").join(""),
      });
    }
  } else {
    await Object.assign(rData, {
      fld_id: rData.fld_id.split(" ").join(""),
      fld_name: rData.fld_name.split(" ").join(""),
      fac_id:
        rData.fld_id.split(" ").join("") +
        "" +
        rData[i].fac_id.split(" ").join(""),
      fac_name: rData.fac_name.split(" ").join(""),
      dept_id:
        rData.fld_id.split(" ").join("") +
        "" +
        rData[i].fac_id.split(" ").join("") +
        "" +
        rData[i].dept_id.split(" ").join(""),
      dept_name: rData.dept_name.split(" ").join(""),
    });
  }
  return rData;
}

const deptQryTxt =
  "SELECT" +
  " รหัสสายงาน AS fld_id" +
  ", ชื่อสายงาน AS fld_name" +
  ", รหัสฝ่ายงาน AS fac_id" +
  ", ชื่อฝ่ายงาน AS fac_name" +
  ", รหัสหน่วยงาน AS dept_id" +
  ", ชื่อหน่วยงาน AS dept_name" +
  " FROM VIEW_DEPT WHERE รหัสหน่วยงาน <> ''";

async function getAllDept() {
  try {
    console.log("getAllDept call try connect to server");
    let pool = await sql.connect(config);
    console.log("connect complete");
    const queryData = await pool.request().query(deptQryTxt);
    let result = deptSpcClr(queryData.recordsets[0]);
    console.log("getAllDept complete");
    console.log("====================");
    return result;
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }
}

async function getUsrReqList(usrReq) {
  try {
    console.log(
      "getUsrReqList from " + usrReq + ", call try connect to server"
    );
    let pool = await sql.connect(config);
    console.log("connect complete");
    let queryData = await pool
      .request()
      .query("SELECT * FROM VIEW_USERREQ WHERE Userreq = '" + usrReq + "'");
    queryData = queryData.recordset[0];
    let result = { status: "error", msg: "User request ไม่ถูกต้อง" };
    let tmp = "";
    if (queryData) {
      // 1 = inactive
      if (queryData.StatusFlag !== "1") {
        tmp = await getPSNDataById(queryData.รหัสพนักงาน);
        queryData = await pool
          .request()
          .query(
            "SELECT * FROM VIEW_USERREQ WHERE รหัสพนักงาน = '" +
              queryData.รหัสพนักงาน +
              "'"
          );
        queryData = queryData.recordsets[0];
        let usrReqList = [];
        for (let i = 0; i < queryData.length; i += 1) {
          usrReqList.push(queryData[i].Userreq.split(" ").join(""));
        }
        result = { name: `${tmp.pname}${tmp.fname} ${tmp.lname}`, usrReqList };
      }
    }
    // console.log(queryData);
    console.log("getUsrReqList complete");
    console.log("====================");
    return result;
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }
}

async function getVersion() {
  try {
    return process.env.version;
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }
}

module.exports = {
  getAllPSN: getAllPSN,
  getActvPSN: getActvPSN,
  getPSNDataById: getPSNDataById,
  getAllDept: getAllDept,
  getUsrReqList: getUsrReqList,
  getVersion: getVersion,
};
