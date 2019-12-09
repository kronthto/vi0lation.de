export const unitKinds = {
  I: 4096,
  M: 16,
  B: 1,
  A: 256
}

export const standardWeapons = [0, 1, 2, 3, 4, 5, 6, 7]
export const advWeapons = [8, 9, 10, 11, 12, 13, 14, 15]

const ITEMKIND_ALL_ITEM = 40
export const ITEMKIND_SKILL_ATTACK = 50
export const ITEMKIND_SKILL_DEFENSE = 51
export const ITEMKIND_DEFENSE = 16
export const ITEMKIND_ENCHANT = 21

const ITEMKIND_PRIMARY_WEAPON = 44
const ITEMKIND_SECONDARY_WEAPON = 48

export const IS_PRIMARY_WEAPON = kind => standardWeapons.indexOf(kind) !== -1
export const IS_SECONDARY_WEAPON = kind => advWeapons.indexOf(kind) !== -1

export const COMPARE_ITEMKIND = (_REQ_ITEM_KIND, _TARGET_KIND_VAR) => {
  if (_REQ_ITEM_KIND === ITEMKIND_ALL_ITEM) {
    return true
  }
  if (_TARGET_KIND_VAR === _REQ_ITEM_KIND) {
    return true
  }
  switch (_REQ_ITEM_KIND) {
    case ITEMKIND_PRIMARY_WEAPON:
      return IS_PRIMARY_WEAPON(_TARGET_KIND_VAR)
    case ITEMKIND_SECONDARY_WEAPON:
      return IS_SECONDARY_WEAPON(_TARGET_KIND_VAR)
    default:
      //throw new Error('Unexpected _REQ_ITEM_KIND '+_REQ_ITEM_KIND)
      return false
  }
}

export const DES_MAP = {
  STD_MIN: 18,
  STD_MAX: 71,
  STD_PROB: 20,
  ADV_MIN: 19,
  ADV_MAX: 72,
  ADV_PROB: 21,
  STD_EVA: 24,
  ADV_EVA: 25,
  STD_DEF: 22,
  ADV_DEF: 23,
  HP: 13,
  DP: 89,
  STD_PIERCE: 184,
  ADV_PIERCE: 185
}

export const desKeyByDesNum = desNum => {
  let foundPair = Object.entries(DES_MAP).find(pair => pair[1] === desNum)
  return foundPair ? foundPair[0] : false
}

export const baseValuesToDesKeyMap = {
  AbilityMin: `_MIN`,
  AbilityMax: `_MAX`,
  HitRate: '_PROB',
  FractionResistance: '_PIERCE',
  ReAttacktime: '_RA'
}
