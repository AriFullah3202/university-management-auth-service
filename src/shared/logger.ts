// import winston from 'winston'
import path from 'path'
import { createLogger, format, transports } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

// this for date format
const { combine, timestamp, label, printf } = format
const myFormat = printf(({ level, message, label, timestamp }) => {
  const date = new Date(timestamp)
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return `${date.toString()} ${hour} : ${minute} : ${second} [${label}] ${level}: ${message}`
})

// for create suceess file
const logger = createLogger({
  level: 'info',
  format: combine(
    label({ label: 'Arif' }),
    timestamp(),
    //myformat data above mentioned in line
    myFormat
    //this for code beautify
    //prettyPrint()
  ),
  transports: [
    new transports.Console(),
    //it is for using maxfile and maxsize . it will generate new file and remove previous file
    new DailyRotateFile({
      filename: path.join(
        process.cwd(),
        'logs',
        'winston',
        'success',
        '%DATE%-success.log'
      ),
      datePattern: 'YYYY-DD-MM-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'info',
    }),
  ],
})
// create for error file
const errorlogger = createLogger({
  format: combine(
    label({ label: 'Arif' }),
    timestamp(),
    myFormat
    //this for code beautify
    // prettyPrint()
  ),
  level: 'error',
  transports: [
    new transports.Console(),
    //it is for using maxfile and maxsize . it will generate new file and remove previous file
    new DailyRotateFile({
      filename: path.join(
        process.cwd(),
        'logs',
        'winston',
        'error',
        '%DATE%-success.log'
      ),
      datePattern: 'YYYY-DD-MM-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'info',
    }),
  ],
})
// Create a logger for errors

export { logger, errorlogger }
