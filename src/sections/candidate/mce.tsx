'use client';

import { useState } from 'react';
import { Stack, Typography, Radio, RadioGroup, FormControlLabel, Box, Button } from '@mui/material';

import useSWR from 'swr/immutable';
import { fetcher } from 'src/utils/axios';

import axios from 'src/utils/axios';

// ----------------------------------------------------------------------

export function MceView() {
  const [answers, setAnswers] = useState<any>({});

  const { data: dataExam } = useSWR('/candidate', fetcher);

  const replaceImageInText = (text: string) => {
    const imgRegex = /\[img:(.*?)\]/g;
    const baseUrl = 'http://127.0.0.1:8000/static/img/';
    return text.replace(imgRegex, (match, p1) => {
      const imgUrl = `${baseUrl}${p1}`;
      return `<br/><img src="${imgUrl}" alt="Question Image" />`;
    });
  };

  const onSubmit = async () => {
    const dataPost = {
      session_id: dataExam.session_id,
      exam_id: dataExam.exam_id,
      list_answers: answers,
    };
    await axios.post('/candidate', dataPost);
    window.location.reload();
  };

  if (!dataExam) return <></>;

  return !dataExam.err ? (
    <>
      <Stack spacing={1.5} sx={{ mb: 5, textAlign: 'center', textTransform: 'uppercase' }}>
        <Typography variant="h5">Bài thi môn {dataExam.subject_name}</Typography>
      </Stack>
      <Stack spacing={3} sx={{ mb: 5, ml: 10 }}>
        <Typography variant="body2">
          <strong>Chú ý:</strong> Bài thi <b>{dataExam.exam_code}</b> có thời gian là{' '}
          <b>{dataExam.duration} phút</b>, không được sử dụng tài liệu.
        </Typography>
        <Typography variant="body2">
          <strong>Đề thi:</strong> Bài thi gồm <b>{dataExam.number_of_questions}</b> câu hỏi trắc
          nghiệm, mỗi câu có 4 phương án trả lời, chỉ có 1 phương án đúng.
        </Typography>
        <Typography variant="body2">
          <strong>Điểm:</strong> Mỗi câu trả lời đúng được tính điểm, câu trả lời sai hoặc không trả
          lời không bị trừ điểm.
        </Typography>
        <Typography variant="body2">
          <strong>Chấm thi:</strong> Kết quả thi sẽ được công bố sau khi kết thúc thời gian làm bài.
        </Typography>
      </Stack>
      <Stack spacing={3}>
        {dataExam.list_questions.map((question: any, index: any) => (
          <Box key={index} sx={{ border: '1px solid #ccc', borderRadius: '4px', p: 2 }}>
            <Stack key={question.id} spacing={1.5}>
              <Typography variant="h6">Câu {index + 1}:</Typography>
              <Typography
                variant="body1"
                dangerouslySetInnerHTML={{ __html: replaceImageInText(question.question) }}
              />
              <RadioGroup name={`question-${question.id}`}>
                {question.final_options.map((option: any, index: any) => (
                  <FormControlLabel
                    key={index}
                    value={option.content}
                    control={<Radio onClick={() => (answers[question.id] = option.id)} />}
                    label={option.content}
                  />
                ))}
              </RadioGroup>
            </Stack>
          </Box>
        ))}
      </Stack>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ color: 'white', width: '200px' }}
          onClick={onSubmit}
        >
          Nộp bài
        </Button>
      </Box>
    </>
  ) : (
    <>
      <Stack spacing={1.5} sx={{ mb: 5, textAlign: 'center', textTransform: 'uppercase' }}>
        <Typography variant="h5">Bài thi môn {dataExam.subject_name}</Typography>
      </Stack>
      <Stack spacing={3} sx={{ mb: 5, ml: 10 }}>
        <Typography variant="body2">
          Bạn đã hoàn thành bài thi <b>{dataExam.exam_code}</b>. Điểm của bạn là:{' '}
          <b>{dataExam.score}</b>
        </Typography>
      </Stack>
    </>
  );
}
