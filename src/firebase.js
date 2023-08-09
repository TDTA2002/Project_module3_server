import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBYLIFWL9QlCSrYqD4TjbPTeukGbfqzs14",
    authDomain: "key-kit-board.firebaseapp.com",
    projectId: "key-kit-board",
    storageBucket: "key-kit-board.appspot.com",
    messagingSenderId: "123613651695",
    appId: "1:123613651695:web:43a5d8b16be4e52ce8711a",
    measurementId: "G-QW20T8Y2L6"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// tạo ra storage
export const storage = getStorage(app);


/* 
  1st params: your file, 2nd params: folder you need 
  return 
    if failed => false
    if success => url file
*/
export async function uploadFileToStorage(fileUploads, folderName, bufferData) {
    // nếu file là null thì không làm gì hết
    if (!fileUploads) {
        return false
    }

    let fileRef;
    let metadata;
    if (!bufferData) {
        // tên file trên file base
        fileRef = ref(storage, `${folderName}/` + fileUploads.name);
    } else {
        // tên file trên file base
        fileRef = ref(storage, `${folderName}/` + fileUploads.filename);
        metadata = {
            contentType: fileUploads.mimetype,
        };
    }
    let url;
    if (bufferData) {
        // upload file lên fire storage
        url = await uploadBytes(fileRef, bufferData, metadata).then(async res => {
            // khi up thành công thì tìm URL
            return await getDownloadURL(res.ref)
                .then(url => url)
                .catch(er => false)
        })
    } else {
        // upload file lên fire storage
        url = await uploadBytes(fileRef, fileUploads).then(async res => {
            // khi up thành công thì tìm URL
            return await getDownloadURL(res.ref)
                .then(url => url)
                .catch(er => false)
        })
    }


    return url
}

/* 
  only params: folder name
  return 
    if failed => false
    if success => array url link
*/
export async function getFileInFolder(folderName) {
    const listRef = ref(storage, folderName);

    return await listAll(listRef).then(async (res) => {
        let result = []; // tạo array trống

        for (let i in res.items) {
            let url = await getDownloadURL(res.items[i])
                .then(url => url)
                .catch(er => false)
            if (!url) {
                return false
            }
            result.push(url)
        }

        return result
    })
} 