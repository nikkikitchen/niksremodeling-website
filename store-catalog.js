export const catalog = [
  {
    "id": "1963146233541074945",
    "name": "Farmington Nightstand",
    "category": "bedroom",
    "image": "https://cf.cjdropshipping.com/af0eb536-ff3c-429c-ae33-aa318b19d3c8.jpg",
    "variantId": "1963146233666904066",
    "departments": [
      "bedroom",
      "kids-room",
      "storage"
    ]
  },
  {
    "id": "1948331715420319745",
    "name": "8-Drawer Tall Dresser",
    "category": "bedroom",
    "image": "https://cf.cjdropshipping.com/83138fc3-1faf-45b0-b0bf-ea0397c91316.png",
    "departments": [
      "bedroom",
      "kids-room",
      "storage"
    ]
  },
  {
    "id": "2018196604472451073",
    "name": "5-Drawer Dresser",
    "category": "bedroom",
    "image": "https://cf.cjdropshipping.com/5c473669-9ea1-4617-90c9-3f972426a810.jpg",
    "departments": [
      "bedroom",
      "kids-room",
      "storage"
    ]
  },
  {
    "id": "2018212592918781954",
    "name": "Bristol 6-Drawer Dresser",
    "category": "bedroom",
    "image": "https://cf.cjdropshipping.com/f4cf1d2e-b950-47b2-97ff-0a081ef8e961.jpg",
    "departments": [
      "bedroom",
      "kids-room",
      "storage"
    ]
  },
  {
    "id": "2009851343057022978",
    "name": "10-Shelf Bookcase",
    "category": "home-office",
    "image": "https://cf.cjdropshipping.com/17680032/88c0d312-021e-45ed-bc32-85d85a5efaa1.jpg",
    "departments": [
      "home-office",
      "bedroom",
      "living-room",
      "kids-room",
      "storage"
    ]
  },
  {
    "id": "2110990556732407810",
    "name": "Kids Christmas Bean Bag Chair with Removable Cushion",
    "category": "kids-room",
    "image": "https://cf.cjdropshipping.com/357c2c80-bf74-4b53-b3b5-d3397a3e29cc.jpg",
    "departments": [
      "kids-room",
      "bedroom",
      "living-room"
    ]
  },
  {
    "id": "2086729295527268354",
    "name": "Fluffy Bean Bag Lounge Chair",
    "category": "living-room",
    "image": "https://cf.cjdropshipping.com/8db1ea62-07c4-4829-ba04-cfb9762bfde2.jpg",
    "departments": [
      "living-room",
      "bedroom",
      "kids-room"
    ]
  },
  {
    "id": "2013543664478601218",
    "name": "Reading Chair with Cushioned Seat",
    "category": "living-room",
    "image": "https://cf.cjdropshipping.com/e27ffc58-6883-4f1a-9e03-a5f0430b169e.jpeg",
    "departments": [
      "living-room",
      "bedroom",
      "home-office"
    ]
  },
  {
    "id": "1985992962627067905",
    "name": "Recliner Chair",
    "category": "living-room",
    "image": "https://cf.cjdropshipping.com/8873bf77-f1ea-44c8-a0fe-c8cc273c745e.png",
    "departments": [
      "living-room",
      "bedroom"
    ]
  }
];
export const categories = {
 "bathroom":"Bathroom Furniture","bedroom":"Bedroom","decor":"Decor & Accessories",
 "dining-room":"Dining Room","entryway":"Entryway","home-office":"Home Office",
 "kids-room":"Kids’ Room","lighting":"Lamps & Lighting","living-room":"Living Room",
 "outdoor":"Outdoor Furniture","storage":"Storage & Organization"
};

/** Store the item once; display it wherever customers would reasonably use it. */
export function relatedCategories(product){
 const name=String(product?.name||'').toLowerCase();
 const out=new Set([product?.category,...(product?.departments||[])]);
 const add=(...rooms)=>rooms.forEach(room=>out.add(room));
 const kid=/\b(kids?|children|child|toddler|nursery|playroom|baby)\b/i.test(name);
 const bookshelf=/\b(bookcases?|bookshelves|bookshelf|shelving|shelves|shelf|book shelves?)\b/i.test(name);
 const seat=/\b(bean\s*bags?|chairs?|sofas?|couches?|recliners?|loveseats?|armchairs?)\b/i.test(name);
 const clothing=/\b(dressers?|chest of drawers|nightstands?|bedside tables?|wardrobes?|armoires?)\b/i.test(name);
 const desk=/\b(desks?|writing tables?|workstations?)\b/i.test(name);
 if(bookshelf)add('storage','bedroom','living-room','home-office','kids-room');
 if(seat)add('living-room','bedroom');
 if(clothing)add('bedroom','storage','kids-room');
 if(desk)add('home-office','bedroom');
 if(kid)add('kids-room');
 if(/\b(console tables?|entryway benches?|hallway tables?)\b/i.test(name))add('entryway','living-room');
 if(/\b(storage|organizer|cabinet|shelving|drawer|drawers)\b/i.test(name))add('storage');
 if(/\b(lamps?|lighting|sconces?)\b/i.test(name))add('lighting','bedroom','living-room');
 if(/\b(wall decor|wall art|mirrors?)\b/i.test(name))add('decor');
 if(/\b(patio|outdoor|garden furniture)\b/i.test(name))add('outdoor');
 if(/\b(dining tables?|dining chairs?)\b/i.test(name))add('dining-room');
 if(/\b(bathroom|vanity cabinet|medicine cabinet)\b/i.test(name))add('bathroom');
 return [...out].filter(room=>Object.hasOwn(categories,room));
}
export function inCategory(product,category){
 return !Object.hasOwn(categories,category)||relatedCategories(product).includes(category);
}
