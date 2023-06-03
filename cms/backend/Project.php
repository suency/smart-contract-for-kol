<?php

namespace app\polygon\controller;

use app\BaseController;
use app\utils\ReturnJson;
use think\facade\Db;
use think\Request;
use \Exception;
use app\polygon\model\ProjectModel;
use app\polygon\model\KolModel;
use app\polygon\model\TransactionsModel;

class Project extends BaseController
{
   // index controller, just for testing purpose
   public function index()
   {
      $url = "http://localhost:8888/polygon/compileContract";
      $json = file_get_contents($url);
      $re = new ReturnJson([json_decode($json, true)]);
      return json($re->json);
   }

   // get abi from local node server which used for metamask in Chrome
   // node server will compile solidity using solc.js
   public function getAbi()
   {

      //$url = "http://localhost:8888/polygon/compileContract";
      $url = "https://data.rabbitgo.io/polygon/project/index";
      $json = file_get_contents($url);
      // $re = new ReturnJson([json_decode($json, true)]);
      return json(json_decode($json, true));
   }

   public function getProjects(Request $request)
   {
      if ($request->method() == 'OPTIONS') {
         exit('options requests');
      }
      $db = ProjectModel::select();
      $re = new ReturnJson($db);
      return json($re->json);
   }

   public function commisson(Request $request)
   {
      if ($request->method() == 'OPTIONS') {
         exit('options requests');
      }
      
      $pro = ProjectModel::where('promotion_code',$request->param('pro'))->select();
      $db = KolModel::where('code',$request->param('ref'))->select();
      return json(["status"=>"ok", "kol_address"=>$db[0]['address'], "name" => $db[0]['name'], "contract" => $pro[0]['contract_address']]);
   }

   public function recordTransaction(Request $request)
   {
      if ($request->method() == 'OPTIONS') {
         exit('options requests');
      }
      
      $transactionInfo = $request->param('transactionInfo');
      $transactionsModel = new TransactionsModel();
      $resultTrans = $transactionsModel->save($transactionInfo);
      
      return json(["status"=>"ok", "info"=>$resultTrans]);
   }

   public function getTransaction(Request $request)
   {
      if ($request->method() == 'OPTIONS') {
         exit('options requests');
      }
      
      $db = TransactionsModel::select();
      $re = new ReturnJson($db);
      return json($re->json);
   }

   public function getProjectsById(Request $request)
   {
      if ($request->method() == 'OPTIONS') {
         exit('options requests');
      }
      $db = ProjectModel::where('id',$request->param('id'))->select();
      $db2 = KolModel::select(array_map('intval', explode(',', $db[0]["kol_ids"])));

      $db[0]['kols'] = $db2;
      $re = new ReturnJson($db);
      return json($re->json);
   }

   public function createProjects(Request $request)
   {
      if ($request->method() == 'OPTIONS') {
         exit('options requests');
      }

      //save koldata
      $kolData = $request->param('kols');
      for($i = 0; $i<sizeof($kolData);$i++){
         $kolData[$i]['code'] = 'kol'.uniqid();
      }

      // var_dump($kolData);die;
      $KolModel = new KolModel();
      $resultKol = $KolModel->saveAll($kolData);

      $ids = [];
      for ($i = 0; $i < sizeof($resultKol); $i++) {
         array_push($ids, $resultKol[$i]["id"]);
      }

      $ProjectModel = new ProjectModel;
      $uploadData = [
         'project_name'  =>  $request->param('project_name'),
         'web3_project_name'  =>  $request->param('web3_project_name'),
         'project_starttime' =>  $request->param('project_starttime'),
         'project_endtime' =>  $request->param('project_endtime'),
         'contract_address' =>  $request->param('contract_address'),
         'commission_rule' =>  $request->param('commission_rule'),
         'creator_address' =>  $request->param('creator_address'),
         'rule_name' =>  $request->param('rule_name'),
         'kol_ids' =>  implode(',', $ids),
         'promotion_code' =>  'project'.uniqid()
      ];

      $re_save = $ProjectModel->save($uploadData);

      if ($re_save) {
         $temp = new ReturnJson(["msg" => 'Save Successfullly']);
      } else {
         $temp = new ReturnJson(["msg" => 'system error'], "fail");
      }
      return json($temp->json);
   }

   public function updateProjects(Request $request)
   {
      if ($request->method() == 'OPTIONS') {
         exit('options requests');
      }
      //save koldata
      $kolData = $request->param('kols');
      for ($i = 0; $i < sizeof($kolData); $i++) {
         if(empty($kolData[$i]["code"])){
            $kolData[$i]["code"] = 'kol'.uniqid();
         }
      }
      $KolModel = new KolModel();
      $resultKol = $KolModel->saveAll($kolData);

      
      $ids = [];
      for ($i = 0; $i < sizeof($resultKol); $i++) {
         array_push($ids, $resultKol[$i]["id"]);
      }
      
      $ProjectModel = ProjectModel::where('id',$request->param('id'))->find();
      
      $ProjectModel->project_name  =  $request->param('project_name');
      $ProjectModel->web3_project_name  =  $request->param('web3_project_name');
      $ProjectModel->project_starttime =  $request->param('project_starttime');
      $ProjectModel->project_endtime =  $request->param('project_endtime');
      $ProjectModel->contract_address =  $request->param('contract_address');
      $ProjectModel->commission_rule =  $request->param('commission_rule');
      $ProjectModel->creator_address =  $request->param('creator_address');
      $ProjectModel->rule_name =  $request->param('rule_name');
      $ProjectModel->kol_ids =  implode(',', $ids);

      $re_save = $ProjectModel->save();
      // var_dump($re_save);die;
      if ($re_save) {
         $temp = new ReturnJson(["msg" => 'Edit Successfullly']);
      } else {
         $temp = new ReturnJson(["msg" => 'system error'], "fail");
      }
      return json($temp->json);
   }
}
