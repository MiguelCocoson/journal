const journalEntries = document.querySelector('#entry-list');
const form = document.querySelector('#add-entry');

// Create data elements
function dataElements(doc){
    let li = document.createElement('li');
    let date = document.createElement('span');
    let entry = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    date.textContent = doc.data().date;
    entry.textContent = doc.data().entry;
    cross.textContent = 'X';

    li.appendChild(date);
    li.appendChild(entry);
    li.appendChild(cross);

    journalEntries.appendChild(li);

    // Delete data
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('journal').doc(id).delete();
    });
}

// Order data
db.collection('journal').orderBy('date').get().then(snapshot => {
    snapshot.docs.forEach(doc => {
        dataElements(doc);
    });
});

// Safe data
form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('journal').add({
        date: form.date.value,
        entry: form.entry.value
    });
    form.date.value = '';
    form.entry.value = '';
});

db.collection('journal').orderBy('entry').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        console.log(change.doc.data());
        if(change.type == 'added'){
            dataElements(change.doc);
        } else if (change.type == 'removed'){
            let li = journalEntries.querySelector('[data-id=' + change.doc.id + ']');
            journalEntries.removeChild(li);
        }
    });
});