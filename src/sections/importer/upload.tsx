'use client';

import {
  Stack,
  Box,
  Typography,
  Card,
  Divider,
  CardHeader,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { _tags } from 'src/_mock';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import LoadingButton from '@mui/lab/LoadingButton';
import { z as zod } from 'zod';
import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'src/utils/axios';
import { toast } from 'src/components/snackbar';

// ----------------------------------------------------------------------

export type NewExamSchemaType = zod.infer;

export const NewExamSchema = zod.object({
  file_question: schemaHelper.file({
    message: { required_error: 'File đề là trường dữ liệu bắt buộc' },
  }),
});

// ----------------------------------------------------------------------

export function UploadView() {
  const [finalData, setFinalData] = useState<any>(null);

  const answerOptions = ['A', 'B', 'C', 'D'];

  const defaultValues = useMemo(
    () => ({
      file_question: null,
    }),
    []
  );

  const methods = useForm<NewExamSchemaType>({
    resolver: zodResolver(NewExamSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      reset();
      const formData = new FormData();
      formData.append('file', data.file_question);
      const { data: dataRes } = await axios.post('/question/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log(dataRes);
      if (dataRes.err) toast.error(dataRes.msg);
      else setFinalData(dataRes);
    } catch {
      toast.error('Có lỗi xảy ra, vui lòng thử lại sau!');
    }
  });

  const sendToImport = (data: any) => async () => {
    try {
      const { data: dataRes } = await axios.post('/question/import', data);
      if (dataRes.err) toast.error(dataRes.msg);
      else {
        toast.success('Import đề thành công');
        setFinalData(null);
      }
    } catch {
      toast.error('Có lỗi xảy ra, vui lòng thử lại sau!');
    }
  };

  const replaceImageInText = (text: string) => {
    const imgRegex = /\[img:(.*?)\]/g;
    const baseUrl = 'http://127.0.0.1:8000/static/img/';
    return text.replace(imgRegex, (match, p1) => {
      const imgUrl = `${baseUrl}${p1}`;
      return `<br/><img src="${imgUrl}" alt="Question Image" />`;
    });
  };

  if (!finalData)
    return (
      <>
        <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
          <Card>
            <CardHeader
              title="Nhập đề"
              subheader="Sử dụng phần mềm import tự động file docx vào csdl. Phần mềm có một vài cảnh báo như check định dạng sai,..."
              sx={{ mb: 3 }}
            />
            <Divider />
            <Form methods={methods} onSubmit={onSubmit}>
              <Stack spacing={3} sx={{ p: 3 }}>
                <Field.Upload
                  maxFiles={1}
                  multiple={false}
                  accept={{
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
                      '.docx',
                    ],
                  }}
                  name="file_question"
                  onUpload={() => console.info('ON UPLOAD')}
                />
              </Stack>
            </Form>
          </Card>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <LoadingButton
              type="submit"
              variant="contained"
              size="large"
              onClick={onSubmit}
              loading={isSubmitting}
            >
              Xử lý file
            </LoadingButton>
          </Box>
        </Stack>
      </>
    );

  return (
    <>
      <Stack spacing={1.5} sx={{ mb: 5, textAlign: 'center', textTransform: 'uppercase' }}>
        <Typography variant="h5">Nhập đề</Typography>
      </Stack>
      <Stack spacing={3} sx={{ mb: 5 }}>
        <Typography variant="body2">
          <strong>Môn học:</strong> {finalData.subject}
        </Typography>
        <Typography variant="body2">
          <strong>Số lượng câu hỏi:</strong> {finalData.number_of_questions}
        </Typography>
        <Typography variant="body2">
          <strong>Người làm đề:</strong> {finalData.lecturer}
        </Typography>
        <Typography variant="body2">
          <strong>Thời gian:</strong> {finalData.date}
        </Typography>
      </Stack>
      <Stack spacing={3} sx={{ mb: 5 }}>
        {finalData.list_questions.map((question: any, index: any) => (
          <Box key={index} sx={{ border: '1px solid #ccc', borderRadius: '4px', p: 2 }}>
            <Stack key={index} spacing={1.5}>
              <Typography variant="h6">Câu {index + 1}:</Typography>
              <Typography
                variant="body1"
                dangerouslySetInnerHTML={{ __html: replaceImageInText(question.question_text) }}
              />
              <RadioGroup name={`question-${index}`}>
                {[question.option1, question.option2, question.option3, question.option4].map(
                  (option: any, index: any) => (
                    <FormControlLabel
                      key={index}
                      value={index}
                      control={<Radio disabled />}
                      label={option}
                    />
                  )
                )}
              </RadioGroup>
              <Typography variant="body1">
                <strong>Đáp án đúng:</strong> {answerOptions[question.answer - 1]}
              </Typography>
              <Typography variant="body1">
                <strong>Số điểm:</strong> {question.mark}
              </Typography>
              <Typography variant="body1">
                <strong>Đơn vị:</strong> {question.unit}
              </Typography>
              <Typography variant="body1">
                <strong>Trộn đáp án:</strong> {question.mix ? 'Có' : 'Không'}
              </Typography>
            </Stack>
          </Box>
        ))}
      </Stack>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          onClick={sendToImport(finalData)}
          loading={isSubmitting}
        >
          Xác nhận lưu
        </LoadingButton>
      </Box>
    </>
  );
}
