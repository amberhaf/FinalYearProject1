import { datab } from '../services/firebase';

export function GetEvent(id) {
  return datab.collection('events').where('id','==',id).get();
}
export function GetEvents(uid) {
  return datab.collection('events').where('ownerId','==',uid).get();
}
export function GetEventsSpecific(uid, module) {
  return datab.collection('events').where('ownerId','==',uid).where('module','==', module).get();
}
export function GetModules(uid) {
  return datab.collection('modules').where('ownerId','==',uid).get();
}
export function GetAssignment(uid) {
  return datab.collection('assignment').where('ownerId','==',uid).get();
}
export function UpdateEvents(id) {
  return datab.collection('events').doc(id)
}
export function UpdateModules(id) {
  return datab.collection('modules').doc(id)
}
export function UpdateAssignment(id) {
  return datab.collection('assignment').doc(id)
}