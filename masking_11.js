use Masking_DB

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
let result = '';
var dl = new Date();
print("Masking started at: "+dl);
const newArray = [];

   var collections = db.getCollectionNames();
   collections.forEach(function(collection) {
   newArray.push (collection);
   });

      function maskFields(doc) {
       for (const field in doc) {
       // current field exists and current field name is not equal to isMasked
        if(doc.hasOwnProperty(field) && field !== 'isMasked') {
            if(doc[field] && typeof doc[field] === 'object') {
               maskFields(doc[field]);
            }else if(field == 'StartDateTime' || field == 'EndDateTime' || field == 'Createdon') {
                doc[field] = new Date();
            } else if (field == 'PatientName' || field == 'ReviewerUserRef' || field =='PatientLastName') {
               // generate a random 10 char string
               for(let i=0;i<10;i++) {
                  const randomIndex = Math.floor(Math.random() * characters.length);
                  result += characters.charAt(randomIndex);
               }
               doc[field] = result;
               result = '';
               }else if(field == 'Path') {
               // change any path to static value
               doc[field] = "//vm_fs01/Projects/EHRQAReports/sampledoc.pdf";
               }else {
                doc[field] = 'xxxxxxxxxx';
               }
              }
             }
               return doc;
            }
         
                  var count = 0;
                  const collectionNames = db.getCollectionNames();
                  let previousCollection = null;
                  collectionNames.forEach(collectionName => {
                     const collection = db.getCollection(collectionName);
                     if (collectionName !== previousCollection) {
                        notifyOnChange(collectionName);
                        previousCollection = collectionName;
                  }
                  var bulkOp = collection.initializeOrderedBulkOp();
                  collection.find({isMasked: false}).forEach(docl => {
                  
                  count++;
                  const maskedDoc=maskFields(docl);
                  maskedDoc.isMasked = true;
                  
                  bulkOp.find({'_id': docl._id}).update({
                     '$set': maskedDoc
                  });
                  
                  if (count > 200) {
                     bulkOp.execute();
                     bulkOp = collection.initializeOrderedBulkOp();
                     count = 0;
                  }
               })
                  if (count !== 0 && count < 200) {
                     bulkOp.execute();
                     bulkOp = collection.initializeOrderedBulkOp();
                     count = 0;  
                  }
               })
                  

               function notifyOnChange(collName){
                  print("collection : "+collName+"  Masking in progress...")
               }
               var d2 = new Date();
               print("masking ended at : "+d2);
               print("masking done...");