export default {
  "kind": "collectionType",
  "collectionName": "weddings",
  "info": {
    "singularName": "wedding",
    "pluralName": "weddings",
    "displayName": "Wedding"
  },
  "options": {
    "draftAndPublish": false
  },
  "attributes": {
    "eventName": { "type": "string", "required": true },
    "date": { "type": "date", "required": true },
    "coverMessage": { "type": "text" },
    "guests": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::guest.guest",
      "mappedBy": "wedding"
    }
  }
};
