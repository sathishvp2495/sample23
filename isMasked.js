var collections = db.getCollectionNames();
collections.forEach(function(collection){
	var fieldExists = db.getCollection(collection).findOne({isMasked:{$exists:true}});
	print('collection : ',collection);
	print("------");
	if(!fieldExists){
		db.getCollection(collection).updateMany(
			{isMasked:{$exists:false}},
			{$set:{isMasked:false}}
			);
		print(`Added 'isMasked' field to collection: ${collection}`);

		}else{
			print(`'isMasked' field already present in collection: ${collection}`);
		}
	});