// HTMLCollection HAS NO forEach —> ADD IT
if (window.HTMLCollection) HTMLCollection.prototype.forEach = Array.prototype.forEach;
