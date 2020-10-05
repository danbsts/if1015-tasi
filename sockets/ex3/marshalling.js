const toInt = {
  '+': 0,
  '-': 1,
  '*': 2,
  '/': 3,
}

const toStr = {
  0: '+',
  1: '-',
  2: '*',
  3: '/',
}

const marshallOperation = (operation) => {
  const data = operation.split(' ')
  const buff = Buffer.allocUnsafe(17);
  buff.writeUInt8(toInt[data[0]]);
  buff.writeDoubleBE(data[1], 1);
  buff.writeDoubleBE(data[2], 9);
  return buff;
}

const marshallResult = (data) => {
  const buff = Buffer.allocUnsafe(8);
  buff.writeDoubleBE(data);
  return buff;
}


const unmarshallOperation = (buf) => {
  return `${toStr[buf.readUInt8(0)]} ${buf.readDoubleBE(1)} ${buf.readDoubleBE(9)}`;
}

const unmarshallResult = (buf) => {
  return buf.readDoubleBE(0);
}

module.exports = {
  marshallOperation,
  marshallResult,
  unmarshallOperation,
  unmarshallResult,
}