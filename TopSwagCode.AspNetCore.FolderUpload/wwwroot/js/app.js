// Drop handler function to get all files
async function getAllFileEntries(dataTransferItemList) {
    let fileEntries = [];
    // Use BFS to traverse entire directory/file structure
    let queue = [];
    // Unfortunately dataTransferItemList is not iterable i.e. no forEach
    for (let i = 0; i < dataTransferItemList.length; i++) {
        queue.push(dataTransferItemList[i].webkitGetAsEntry());
    }
    while (queue.length > 0) {
        let entry = queue.shift();
        if (entry.isFile) {
            fileEntries.push(entry);
        } else if (entry.isDirectory) {
            let reader = entry.createReader();
            queue.push(...await readAllDirectoryEntries(reader));
        }
    }
    return fileEntries;
}

// Get all the entries (files or sub-directories) in a directory by calling readEntries until it returns empty array
async function readAllDirectoryEntries(directoryReader) {
    let entries = [];
    let readEntries = await readEntriesPromise(directoryReader);
    while (readEntries.length > 0) {
        entries.push(...readEntries);
        readEntries = await readEntriesPromise(directoryReader);
    }
    return entries;
}

// Wrap readEntries in a promise to make working with readEntries easier
async function readEntriesPromise(directoryReader) {
    try {
        return await new Promise((resolve, reject) => {
            directoryReader.readEntries(resolve, reject);
        });
    } catch (err) {
        console.log(err);
    }
}

var elDrop = document.getElementById('dropzone');
var elItems = document.getElementById('items');

elDrop.addEventListener('dragover', function (event) {
    event.preventDefault();
    elItems.innerHTML = 0;
});

elDrop.addEventListener('drop', async function (event) {
    event.preventDefault();
    let items = await getAllFileEntries(event.dataTransfer.items);
    elItems.innerHTML = items.length;

    for (let i = 0; i < items.length; i++) {

        if (items[i].isFile) {
            ReadFileAndUpload(items[i], console.log, console.log)
        }
    }
    
});

function ReadFileAndUpload(entry, successCallback, errorCallback) {
    entry.file(function (file) {
        let reader = new FileReader();

        var li = document.createElement('li');
        li.setAttribute("id", entry.fullPath);
        li.innerHTML = entry.fullPath;

        elItems.appendChild(li);

        reader.onload = function () {

            var url = '/upload/' + encodeURIComponent(entry.name) + '/' + encodeURIComponent(entry.fullPath); 

            fetch(url, {
                method: 'POST',
                body: file
            }).then(
                // success => console.log(success)
            ).catch(
                error => console.log(error)
            );

            //successCallback(reader.result);
        };

        reader.onerror = function () {
            errorCallback(reader.error);
        }

        reader.readAsText(file);
    }, errorCallback);
}