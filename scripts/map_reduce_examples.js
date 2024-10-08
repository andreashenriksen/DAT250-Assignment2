const { MongoClient } = require('mongodb');
const uri = 'mongodb://localhost:27017';

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {

    await client.connect();
    const db = client.db('MyDatabase');

    console.log("\nInserting documents");
    result = await db.collection('orders').insertMany([
        { _id: 1, cust_id: "Ant O. Knee", ord_date: new Date("2020-03-01"), price: 25, items: [ { sku: "oranges", qty: 5, price: 2.5 }, { sku: "apples", qty: 5, price: 2.5 } ], status: "A" },
        { _id: 2, cust_id: "Ant O. Knee", ord_date: new Date("2020-03-08"), price: 70, items: [ { sku: "oranges", qty: 8, price: 2.5 }, { sku: "chocolates", qty: 5, price: 10 } ], status: "A" },
        { _id: 3, cust_id: "Busby Bee", ord_date: new Date("2020-03-08"), price: 50, items: [ { sku: "oranges", qty: 10, price: 2.5 }, { sku: "pears", qty: 10, price: 2.5 } ], status: "A" },
        { _id: 4, cust_id: "Busby Bee", ord_date: new Date("2020-03-18"), price: 25, items: [ { sku: "oranges", qty: 10, price: 2.5 } ], status: "A" },
        { _id: 5, cust_id: "Busby Bee", ord_date: new Date("2020-03-19"), price: 50, items: [ { sku: "chocolates", qty: 5, price: 10 } ], status: "A"},
        { _id: 6, cust_id: "Cam Elot", ord_date: new Date("2020-03-19"), price: 35, items: [ { sku: "carrots", qty: 10, price: 1.0 }, { sku: "apples", qty: 10, price: 2.5 } ], status: "A" },
        { _id: 7, cust_id: "Cam Elot", ord_date: new Date("2020-03-20"), price: 25, items: [ { sku: "oranges", qty: 10, price: 2.5 } ], status: "A" },
        { _id: 8, cust_id: "Don Quis", ord_date: new Date("2020-03-20"), price: 75, items: [ { sku: "chocolates", qty: 5, price: 10 }, { sku: "apples", qty: 10, price: 2.5 } ], status: "A" },
        { _id: 9, cust_id: "Don Quis", ord_date: new Date("2020-03-20"), price: 55, items: [ { sku: "carrots", qty: 5, price: 1.0 }, { sku: "apples", qty: 10, price: 2.5 }, { sku: "oranges", qty: 10, price: 2.5 } ], status: "A" },
        { _id: 10, cust_id: "Don Quis", ord_date: new Date("2020-03-23"), price: 25, items: [ { sku: "oranges", qty: 10, price: 2.5 } ], status: "A" }
    ])
    console.log(`Inserted ${result.insertedCount} documents with ids:`);
    console.log(result.insertedIds);
    
    
    // var mapFunction1 = function() {
    //     emit(this.cust_id, this.price)
    // }

    // var reduceFunction1 = function(keyCustId, valuesPrices) {
    //     return Array.sum(valuesPrices);
    // };

    // await db.collection('orders').mapReduce(
    //     mapFunction1,
    //     reduceFunction1,
    //     { out: "map_reduce_example" }
    // )

    // console.log("\nMap reducing");
    // result = await db.collection('map_reduce_example').find().sort( { _id: 1 } )
    // console.log(result.toArray());

    const agg = [
        {
          '$unwind': '$items'
        }, {
          '$group': {
            '_id': '$cust_id', 
            'total_items': {
              '$sum': '$items.qty'
            }
          }
        }
    ];

    const cursor = db.collection('orders').aggregate(agg);
    result = await cursor.toArray();
    console.log(result);
    await client.close();
    
}

run()
