var firebase = require('firebase/app')
require('firebase/firestore');


var firebaseConfig = {
    apiKey: "AIzaSyCLFHRMO1u-6UREh6q3FbzXBLpxFUUojGU",
    authDomain: "todo-list-a6588.firebaseapp.com",
    projectId: "todo-list-a6588",
    storageBucket: "todo-list-a6588.appspot.com",
    messagingSenderId: "1044997501729",
    appId: "1:1044997501729:web:c6a8edae1baaf822220460"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// const projectStorage = firebase.storage();
const projectFirestore = firebase.firestore();

const timeStamp = firebase.firestore.FieldValue.serverTimestamp;





// const getData = (city, bloodGroup) => {
//     var data = []
//     return new Promise((resolve, reject) => {
//         // console.log("dbName", dbName, "id:", senderId);
//         const collectionRef = projectFirestore.collection("donorData");


//         collectionRef.where('cityName', '==', city).where('bloodGroup', '==', bloodGroup).get().then((querySnapshot) => {
//             if (querySnapshot.docs.length) {
//                 querySnapshot.forEach((doc) => {
//                     data.push({ name: doc.data().firstName, mobileNo: doc.data().mobileNo })
//                 })
//                 // console.log("data", data);
//                 resolve(data)
//             }
//             else
//                 reject("no data found")
//         }).catch((error) => {
//             console.log("Error getting document:", error);
//         });



//     })



//     // snapshot.forEach((doc) => {
//     //     console.log("doc :",doc.data());
//     //     console.log("doc exist",doc.exists);
//     // });

//     // return doc.data().status

// }


const getAllWhatsAppNo = () => {
    var data = []
    return new Promise((resolve, reject) => {
        const collectionRef = projectFirestore.collection("hospitalData");


        collectionRef.get().then((querySnapshot) => {
            if (querySnapshot.docs.length) {
                querySnapshot.forEach((doc) => {
                    data.push(doc.data().whatsappNo)
                })
                // console.log("data", data);
                resolve(data)
            }
            else
                reject("no data found")
        }).catch((error) => {
            console.log("Error getting document:", error);
        });

    })
}

const getDataByNo = (number) => {
    
    return new Promise((resolve, reject) => {
        const collectionRef = projectFirestore.collection("hospitalData");


        collectionRef.where('adminWhatsappNo', '==', number).get().then((querySnapshot) => {
            if (querySnapshot.docs.length) {
                // querySnapshot.forEach((doc) => {
                //     data.push(doc.data().whatsappNo)
                // })
                // console.log("data", data);
                var data = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    whatsappNo: doc.data().adminWhatsappNo,
                    oxygenBed: doc.data().oxygenBed,
                    withoutOxygen: doc.data().withoutOxygen,
                    icuBeds: doc.data().icuBeds,
                    icuVentilatorBeds: doc.data().icuVentilatorBeds,

                }))
                resolve(data)
            }
            else
                reject("no data found")
        }).catch((error) => {
            console.log("Error getting document:", error);
        });

    })

}

const updateDataById = (obj) => {
    return new Promise((resolve, reject) => {
        const collectionRef = projectFirestore.collection("hospitalData");
        collectionRef.doc(obj.id).update({
            'updatedAt' : timeStamp(),
            'vacWithoutOxygenBed' : obj[1],
            'vacOxygenBed' : obj[2],
            'vacIcubeds' : obj[3],
            'vacIcuVentilatorBeds' : obj[4],
        }).then((ack) => {
           console.log("data updated succesfully", ack);
            resolve("sent");
        }
        ).catch((error) =>{
            console.log("Error updating document:", error);
            reject("error")
        })
    })
}

module.exports = { getAllWhatsAppNo, getDataByNo, updateDataById };