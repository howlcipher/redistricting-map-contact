const fs = require('fs');

let data = JSON.parse(fs.readFileSync('public/data.json', 'utf8'));

const routeUpdates = {
  "Mike Johnson": "https://mikejohnson.house.gov/contact/",
  "Steve Scalise": "https://scalise.house.gov/contact",
  "Hakeem Jeffries": "https://jeffries.house.gov/contact",
  "Chuck Schumer": "https://www.schumer.senate.gov/contact/email-chuck",
  "Gretchen Whitmer": "https://somgovweb.state.mi.us/GovWeb/ContactGov.aspx",
  "Gavin Newsom": "https://www.gov.ca.gov/contact/",
  "Ron DeSantis": "https://www.flgov.com/contact-governor/",
  "Gary Peters": "https://www.peters.senate.gov/contact/email-gary",
  "Elissa Slotkin": "https://slotkin.house.gov/contact",
  "Bernie Sanders": "https://www.sanders.senate.gov/contact/",
  "Alexandria Ocasio Cortez": "https://ocasio-cortez.house.gov/contact",
  "Ro Khanna": "https://khanna.house.gov/contact",
  "Rashida Tlaib": "https://tlaib.house.gov/contact",
  "Ilhan Omar": "https://omar.house.gov/contact",
  "Pramila Jayapal": "https://jayapal.house.gov/contact",
  "Andrew Ross Sorkin": "andrew.sorkin@nytimes.com",
  "Steve Kornacki": "contact.nbcnews@nbcuni.com",
  "Harry Enten": "harry.enten@cnn.com",
  "Nate Silver": "nate@natesilver.net",
  "Dave Wasserman": "dave@cookpolitical.com",
  "G. Elliott Morris": "g.elliott.morris@abc.com",
  "Jessica Tarlov": "jessica.tarlov@foxnews.com",
  "Charles Payne": "charles.payne@foxbusiness.com",
  "Hasan Piker": "hasanabi@gmail.com",
  "Krystal and Saagar": "breakingpoints@gmail.com",
  "Kyle Kulinski": "seculartalkradio@gmail.com",
  "Tucker Carlson": "info@tuckercarlson.com",
  "John Oliver": "info@hbo.com",
  "More Perfect Union": "info@perfectunion.us",
  "Sam Seder": "majorityreporter@gmail.com",
  "David Pakman": "info@davidpakman.com",
  "Ana Kasparian": "ana@tyt.com",
  "Brian Tyler Cohen": "briantylercohen@gmail.com",
  "Ryan Grim": "ryan@dropsitenews.com",
  "DNC": "https://democrats.org/contact-us/",
  "RNC": "https://gop.com/contact-us/",
  "DSA Party": "info@dsausa.org",
  "Our Revolution": "info@ourrevolution.com",
  "John Stossel": "info@johnstossel.com",
  "Andrew Wang": "info@forwardparty.com",
  "John Thune": "https://www.thune.senate.gov/public/index.cfm/contact",
  "JD Vance": "https://www.whitehouse.gov/contact/",
  "Donald Trump": "https://www.whitehouse.gov/contact/"
};

data = data.map(contact => {
  if (routeUpdates[contact.name]) {
    contact.contactRoute = routeUpdates[contact.name];
  }
  return contact;
});

fs.writeFileSync('public/data.json', JSON.stringify(data, null, 2));
console.log('Updated routes!');
