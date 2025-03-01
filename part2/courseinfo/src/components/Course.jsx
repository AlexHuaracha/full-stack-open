import Header from "./Header";
import Content from "./Content";

const Course = ({ course }) => { 
  // console.log(course.parts);
    return (
      <div>
        <Header courseName={course.name} />
        <Content courseParts={course.parts} />
      </div>
    )
};

export default Course;