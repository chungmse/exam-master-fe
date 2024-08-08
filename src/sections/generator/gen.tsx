'use client';

import { Stack, Box } from '@mui/material';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import { useForm } from 'react-hook-form';
import { _tags } from 'src/_mock';
import { Form, Field } from 'src/components/hook-form';
import LoadingButton from '@mui/lab/LoadingButton';
import { z as zod } from 'zod';

import useSWR from 'swr/immutable';
import { fetcher } from 'src/utils/axios';

import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'src/utils/axios';

import { toast } from 'src/components/snackbar';

// ----------------------------------------------------------------------

export type NewExamSchemaType = zod.infer;

export const NewExamSchema = zod.object({
  subject_id: zod.string().min(1, { message: 'Môn thi là trường dữ liệu bắt buộc!' }),
  exam_code: zod.string().min(1, { message: 'Mã đề thi là trường dữ liệu bắt buộc!' }),
  duration: zod.number().min(1, { message: 'Thời gian thi là trường dữ liệu bắt buộc!' }),
  number_of_questions: zod.number().min(1, { message: 'Số câu hỏi là trường dữ liệu bắt buộc!' }),
});

// ----------------------------------------------------------------------

export function GenView() {
  const defaultValues = useMemo(
    () => ({
      subject_id: '1',
      exam_code: '',
      duration: 60,
      number_of_questions: 10,
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
      const { data: dataRes } = await axios.post('/exam', {
        subject_id: data.subject_id,
        exam_code: data.exam_code,
        duration: data.duration,
        number_of_questions: data.number_of_questions,
      });
      dataRes.err ? toast.error(dataRes.msg) : toast.success(dataRes.msg);
    } catch {
      toast.error('Có lỗi xảy ra, vui lòng thử lại sau!');
    }
  });

  const { data: dataSubject, isLoading } = useSWR('/subject', fetcher);
  if (isLoading) return <></>;

  return (
    <>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        <Card>
          <CardHeader
            title="Sinh đề"
            subheader="Tạo đề thi theo môn, trong đó câu trả lời được xáo trộn thứ tự một cách ngẫu nhiên. Thông số được thiết lập: mã đề thi, thời gian thi (duration), số câu hỏi trong 1 đề."
            sx={{ mb: 3 }}
          />

          <Divider />
          <Form methods={methods} onSubmit={onSubmit}>
            <Stack spacing={3} sx={{ p: 3 }}>
              <Box
                columnGap={2}
                rowGap={3}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
              >
                <Field.Select
                  native
                  name="subject_id"
                  label="Môn thi"
                  InputLabelProps={{ shrink: true }}
                >
                  {dataSubject.map((subject: any) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.subject_name}
                    </option>
                  ))}
                </Field.Select>
                <Field.Text name="exam_code" label="Mã đề thi" />

                <Field.Text
                  name="duration"
                  label="Thời gian thi (phút)"
                  placeholder="0"
                  type="number"
                  InputLabelProps={{ shrink: true }}
                />
                <Field.Text
                  name="number_of_questions"
                  label="Số câu hỏi"
                  placeholder="0"
                  type="number"
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
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
            Tạo đề thi
          </LoadingButton>
        </Box>
      </Stack>
    </>
  );
}
