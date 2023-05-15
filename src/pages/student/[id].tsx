import { ColumnsType } from "antd/es/table";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Table, Tag } from "antd";

interface DataType {
  attendanceId: string;
  classDept: string;
  classDivision: number;
  classSubject: string;
  classYear: string;
  duration: number;
  startTime: number;
  students: string;
  tag: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: "Class",
    dataIndex: "class",
    key: "class",
    render: (_, record) => <p>{record.classYear + "-" + record.classDivision + " " + record.classDept}</p>,
    width: "25%",
  },
  {
    title: "Subject",
    dataIndex: "subject",
    key: "subject",
    sorter: (a, b) => a.classSubject.localeCompare(b.classSubject),
    render: (_, record) => <p>{record.classSubject}</p>,
  },
  {
    title: "Start Date",
    dataIndex: "startDate",
    key: "startDate",
    sorter: (a, b) => a.startTime - b.startTime,
    render: (_, record) => <p>{new Date(record.startTime).toLocaleString()}</p>,
  },
  {
    title: "End Date",
    dataIndex: "endDate",
    key: "endDate",
    sorter: (a, b) => a.startTime + a.duration - (b.startTime + b.duration),
    render: (_, record) => <p>{new Date(record.startTime + record.duration).toLocaleString()}</p>,
  },
  {
    title: "Attendance",
    key: "attendance",
    dataIndex: "attendance",
    render: (_, { tag }) => {
      let color = "green";
      if (tag === "Absent") {
        color = "volcano";
      }
      return (
        <Tag color={color} key={tag}>
          {tag?.toUpperCase()}
        </Tag>
      );
    },
  },
];

const Student = () => {
  const router = useRouter();
  const { id } = router.query;
  const [attendanceCount, setAttendanceCount] = useState<any>();
  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:3000/api/attendanceCount?studentId=${id}&allData=true`).then((response) => {
        const presentAttendanceCount = response.data.presentAttendance.map((row: any) => row.attendanceId);
        const data = response.data.allAttendance.map((row: any) => {
          return { ...row, tag: presentAttendanceCount.includes(row.attendanceId) ? "Present" : "Absent" };
        });
        console.log(data);
        setAttendanceCount(data);
      });
    }
  }, [id]);
  return (
    <div>
      <Head>
        <title>Student {id}</title>
      </Head>
      <Table pagination={false} rowKey="attendanceId" columns={columns} dataSource={attendanceCount} />
    </div>
  );
};

export default Student;
