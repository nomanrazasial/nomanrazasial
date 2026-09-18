Journal cover images
====================

This folder lets you use real cover images in the JOURNALS section.

How to add or replace a cover
-----------------------------
1. Drop your image file in this folder.
2. Open `covers.js`.
3. Add or edit an entry using the journal name as the key.

Example:
window.JOURNAL_COVERS={
  "energy":{
    image:"assets/journal-covers/energy-cover.png",
    publisher:"Elsevier",
    caption:"Energy",
    url:"https://www.sciencedirect.com/journal/energy"
  },
  "international journal of hydrogen energy":{
    image:"assets/journal-covers/ijhe-cover.jpg",
    publisher:"Elsevier",
    caption:"International Journal of Hydrogen Energy",
    url:"https://www.sciencedirect.com/journal/international-journal-of-hydrogen-energy"
  }
};

Important
---------
- The key should match the journal title in lowercase.
- If no image is provided for a journal, the site automatically falls back to the publisher-style card.
- You can replace the sample `energy-cover.png` with any image you prefer.
