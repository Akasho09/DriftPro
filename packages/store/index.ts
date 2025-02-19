import {atom} from 'recoil';

export const balanceattom = atom<number>({
    key: "balanceatom",
    default: 0
})