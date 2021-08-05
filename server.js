require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(cors());
mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true, useUnifiedTopology: true });

// TODO: add authentications.
const isAdmin = false;

const questionSchema = {
  question: {
    content: String,
    date: Date,
  },
  answer: {
    content: String,
    date: Date,
  },
  visibility: Boolean,
};
const Question = mongoose.model('Question', questionSchema);

app
  .route('/questions')
  .get((_req, res) => {
    Question.find(isAdmin ? {} : { visibility: true }, (error, questions) => {
      if (error) {
        res.status(500).json({ message: 'server error' });
      } else {
        res.send(questions);
      }
    });
  })
  .post((req, res) => {
    new Question({
      question: {
        content: req.body.question,
        date: req.body.question && Date.now(),
      },
      visibility: req.body.question && false,
    }).save((error) => {
      if (error) {
        res.status(500).json({ message: 'server error' });
      } else {
        res.status(201).json({ message: 'created' });
      }
    });
  })
  .delete((_req, res) => {
    if (!isAdmin) {
      res.status(401).json({ message: 'unauthorized' });
    } else {
      Question.deleteMany((error) => {
        if (error) {
          res.status(500).json({ message: 'server error' });
        } else {
          res.status(200).json({ message: 'ok' });
        }
      });
    }
  });

app
  .route('/questions/:questionId')
  .get((req, res) => {
    if (!mongoose.isValidObjectId(req.params.questionId)) {
      res.status(404).json({ message: 'not found' });
    } else {
      Question.findOne(
        isAdmin ? { _id: req.params.questionId } : { _id: req.params.questionId, visibility: true },
        (error, question) => {
          if (error) {
            res.status(500).json({ message: 'server error' });
          } else if (!question) {
            res.status(404).json({ message: 'not found' });
          } else {
            res.send(question);
          }
        }
      );
    }
  })
  .put((req, res) => {
    if (!isAdmin) {
      res.status(401).json({ message: 'unauthorized' });
    } else if (!mongoose.isValidObjectId(req.params.questionId)) {
      res.status(404).json({ message: 'not found' });
    } else {
      Question.replaceOne(
        { _id: req.params.questionId },
        {
          question: {
            content: req.body.question,
            date: req.body.question && Date.now(),
          },
          answer: {
            content: req.body.answer,
            date: req.body.answer && Date.now(),
          },
          visibility: req.body.visibility || false,
        },
        (error, result) => {
          if (error) {
            res.status(500).json({ message: 'server error' });
          } else if (result.n !== 1) {
            res.status(404).json({ message: 'not found' });
          } else {
            res.status(200).json({ message: 'ok' });
          }
        }
      );
    }
  })
  .patch((req, res) => {
    if (!isAdmin) {
      res.status(401).json({ message: 'unauthorized' });
    } else if (!mongoose.isValidObjectId(req.params.questionId)) {
      res.status(404).json({ message: 'not found' });
    } else {
      Question.findOne({ _id: req.params.questionId }, (findError, prevQuestion) => {
        if (findError) {
          res.status(500).json({ message: 'server error' });
        } else if (!prevQuestion) {
          res.status(404).json({ message: 'not found' });
        } else {
          Question.updateOne(
            { _id: req.params.questionId },
            {
              question: {
                content: req.body.question || prevQuestion.question.content,
                date: req.body.question ? Date.now() : prevQuestion.question.date,
              },
              answer: {
                content: req.body.answer || prevQuestion.answer.content,
                date: req.body.answer ? Date.now() : prevQuestion.answer.date,
              },
              visibility: req.body.visibility || prevQuestion.visibility,
            },
            (updateError) => {
              if (updateError) {
                res.status(500).json({ message: 'server error' });
              } else {
                res.status(200).json({ message: 'success' });
              }
            }
          );
        }
      });
    }
  })
  .delete((req, res) => {
    if (!isAdmin) {
      res.status(401).json({ message: 'unauthorized' });
    } else if (!mongoose.isValidObjectId(req.params.questionId)) {
      res.status(404).json({ message: 'not found' });
    } else {
      Question.deleteOne({ _id: req.params.questionId }, (error) => {
        if (error) {
          res.status(500).json({ message: 'server error' });
        } else {
          res.status(200).json({ message: 'ok' });
        }
      });
    }
  });

app.use((_req, res) => {
  res.status(404).json({ message: 'not found' });
});

app.listen(process.env.PORT);
