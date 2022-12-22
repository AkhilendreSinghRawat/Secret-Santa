require('dotenv').config()
const express = require('express')
const app = express()

app.use(express.json())
const cors = require('cors')
app.use(cors())

const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2

const OAuth2_client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET
)
OAuth2_client.setCredentials({ refreshToken: process.env.REFRESH_TOKEN })

function send_mail(name, recipient) {
  const accessToken = OAuth2_client.getAccessToken()

  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.USER_EMAIL,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken,
    },
  })

  const mail_options = {
    from: `Akuma <${process.env.USER_EMAIL}>`,
    to: recipient,
    subject: `message from akuma`,
    html: get_html_message(name),
  }

  transport.sendMail(mail_options, function (err, result) {
    if (err) {
      console.log('Error: ', err)
    } else {
      console.log('Success: ', result)
    }
    transport.close()
  })
}

function get_html_message(name) {
  return `<h3>You are ${name}'s Santa .Merry Christmas </h3>`
}

const isPresent = (arr = [], num) => {
  let ans = false
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == num) {
      ans = true
    }
  }
  return ans
}

const get_random = (n) => {
  return Math.floor(Math.random() * n)
}

app.post('/secretSanta', async (req, res) => {
  const data = req.body
  const participantsName = data.map((item) => item.name)
  const p1 = []
  const p2 = []

  while (p1.length !== participantsName.length) {
    let index1 = get_random(participantsName.length)
    let index2 = get_random(participantsName.length)
    if (index1 !== index2) {
      if (!isPresent(p1, index1) && !isPresent(p2, index2)) {
        p1.push(index1)
        p2.push(index2)
      }
    }
  }

  for (let i = 0; i < p1.length; i++) {
    const santa = data[p1[i]]
    const person = data[p2[i]]
    send_mail(`${person.name}`, `${santa.email}`)
  }
})

app.listen(8000, () => {
  console.log('Server started at 8000')
})
