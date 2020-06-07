const convertKey = (key, mode) => {
  const keys = {
    0: {
      1: { pitch: 'C', camelot: '8B', color: '#EE82D9' },
      0: { pitch: 'Cm', camelot: '5A', color: '#FDBFA7' },
    },
    1: {
      1: { pitch: 'C#/Db', camelot: '3B', color: '#86F24F' },
      0: { pitch: 'C#m/Dbm', camelot: '12A', color: '#55F0F0' },
    },
    2: {
      1: { pitch: 'D', camelot: '10B', color: '#9FB6FF' },
      0: { pitch: 'Dm', camelot: '7A', color: '#FDAACC' },
    },
    3: {
      1: { pitch: 'D#/Eb', camelot: '5B', color: '#FFA07C' },
      0: { pitch: 'D#m/Ebm', camelot: '2A', color: '#7DF2AA' },
    },
    4: {
      1: { pitch: 'E', camelot: '12B', color: '#00EBEB' },
      0: { pitch: 'Em', camelot: '9A', color: '#DDB4FD' },
    },
    5: {
      1: { pitch: 'F', camelot: '7B', color: '#FF81B4' },
      0: { pitch: 'Fm', camelot: '4A', color: '#E8DAA1' },
    },
    6: {
      1: { pitch: 'F#/Gb', camelot: '2B', color: '#3CEE81' },
      0: { pitch: 'F#m/Gbm', camelot: '11A', color: '#8EE4F9' },
    },
    7: {
      1: { pitch: 'G', camelot: '9B', color: '#CE8FFF' },
      0: { pitch: 'Gm', camelot: '6A', color: '#FDAFB7' },
    },
    8: {
      1: { pitch: 'G#/Ab', camelot: '4B', color: '#DFCA73' },
      0: { pitch: 'G#m/Abm', camelot: '1A', color: '#56F1DA' },
    },
    9: {
      1: { pitch: 'A', camelot: '11B', color: '#56D9F9' },
      0: { pitch: 'Am', camelot: '8A', color: '#F2ABE4' },
    },
    10: {
      1: { pitch: 'A#/Bb', camelot: '6B', color: '#FF8894' },
      0: { pitch: 'A#m/Bbm', camelot: '3A', color: '#AEF589' },
    },
    11: {
      1: { pitch: 'B', camelot: '1B', color: '#01EDCA' },
      0: { pitch: 'Bm', camelot: '10A', color: '#BECDFD' },
    },
  };
  try {
    return keys[key][mode];
  } catch (err) {
    console.log(err);
    return null;
  }
};

export default convertKey;
