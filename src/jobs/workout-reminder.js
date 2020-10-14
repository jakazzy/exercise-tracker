import { initModels as model } from '../models';
import cron from 'node-cron';
import ejs from 'ejs';
import { config } from '../config/config';
import { transporter } from '../config/sendEmail';

const workoutEmailTemplate = (user, email, url) => {
  ejs.renderFile(
    __dirname + '/../mailtemplate/reset-instruction.ejs',
    { user, url },
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        const mailOptions = {
          from: '',
          to: email,
          subject: 'Reset Password',
          html: data,
        };

        transporter
          .sendMail(mailOptions)
          .then((data) => {
            console.log(`email sent successfully to ${user}`);
            return data;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  );
};

export const WorkoutReminders = () => {
  cron.schedule('0 0 * * 6', async () => {
    const url = `${config.dev.clienturl}/dashboard`;

    const users = await model.User.findAll({
      attributes: ['username', 'email'],
    });

    let init = 0;
    const totalEmails = users.length;

    const sendWorkoutEmail = () => {
      setTimeout(function () {
        let user = users[init];
        workoutEmailTemplate(user.username, user.email, url);
        init++;
        if (init < totalEmails) {
          sendWorkoutEmail();
        }
      }, 3000);
    };

    if (totalEmails) {
      sendWorkoutEmail();
    } else {
      console.log('No user exists');
    }
  });
};

//  get email add of all users and send them emails
