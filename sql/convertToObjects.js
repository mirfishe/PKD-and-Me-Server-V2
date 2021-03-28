// let  bufferString = "fname, lname, uid, phone, address\nJohn, Doe, 1, 444-555-6666, 34 dead rd\nJane, Doe, 2, 555-444-7777, 24 dead rd\nJimmy, James, 3, 111-222-3333, 60 alive way";

let  bufferString = "'categoryID','category','sortID','active','createdAt','updatedAt'\n1,'Novels',1,True,'2020-10-18 23:10:19.256454-04','2020-10-18 23:10:19.256454-04'\n2,'Short Story Collections',2,True,'2020-10-18 23:10:19.256454-04','2020-10-18 23:10:19.256454-04'\n3,'Non Fiction',3,True,'2020-10-18 23:10:19.256454-04','2020-10-18 23:10:19.256454-04'\n4,'Secondary Resources',4,True,'2020-10-18 23:10:19.256454-04','2020-10-18 23:10:19.256454-04'\n5,'Secondary Resources - Blade Runner',5,True,'2020-10-18 23:10:19.256454-04','2020-10-18 23:10:19.256454-04'\n6,'Film',6,True,'2020-10-18 23:10:19.256454-04','2020-10-18 23:10:19.256454-04'\n7,'Television',7,True,'2020-10-18 23:10:19.256454-04','2020-10-18 23:10:19.256454-04'\n8,'Documentaries',8,True,'2020-10-18 23:10:19.256454-04','2020-10-18 23:10:19.256454-04'\n9,'Radio',9,True,'2020-10-18 23:10:19.256454-04','2020-10-18 23:10:19.256454-04'\n10,'Music',10,True,'2020-10-18 23:10:19.256454-04','2020-10-18 23:10:19.256454-04'\n11,'Games',11,True,'2020-10-18 23:10:19.256454-04','2020-10-18 23:10:19.256454-04'\n12,'Short Stories',12,True,'2020-10-19 14:24:53.863-04','2020-10-19 14:24:53.863-04'"

let arr = bufferString.split('\n');     

let jsonObj = [];
let headers = arr[0].split(',');
for(let i = 1; i < arr.length; i++) {
  let data = arr[i].split(',');
  let obj = {};
  for(let j = 0; j < data.length; j++) {
     obj[headers[j].trim()] = data[j].trim();
  }
  jsonObj.push(obj);
}

// alert(JSON.stringify(jsonObj));
// console.log(JSON.stringify(jsonObj));
console.log(jsonObj);