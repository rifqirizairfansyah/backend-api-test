const logger = require("../utils/logger");
const mailService = require("../services/mail_service")

const ordersProcess = async (job, jobDone) => {
  const sendMail  = await mailService.sendMail(job.data.user)
  if (sendMail.code !== 200) {
    console.log("fail job")
    job.fail()
  }
  logger.info(`${job.data.user.FIRST_NAME} ${job.data.user.LAST_NAME}`)
  jobDone();
}

const handlerCompleted = (job) => {
  logger.info(`Job in ${job.queue.name} completed send mail for: ${job.data.user.FIRST_NAME} ${job.data.user.LAST_NAME} on zone ${job.data.user.LOCATION}`)
}

const handlerFailure = (job, err) => {
  if (job.attemptsMade >= job.opts.attempts) {
    logger.info(`Job failures above threshold in ${job.queue.name} for: ${job.id}`, err)
    return null
  }
    logger.info(`Job in ${job.queue.name} failed for: ${job.id} with ${err.message
    }. ${job.opts.attempts - job.attemptsMade} attempts left`)
}

const handlerStalled = (job) => {
  logger.info(`Job in ${job.queue.name} stalled for: ${job.id}`)
}

module.exports = {
  ordersProcess,
  handlerCompleted,
  handlerFailure,
  handlerStalled
}