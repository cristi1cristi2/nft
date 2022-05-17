pragma solidity ^0.8.0;
import "./Color.sol";

contract EduChain {

    address[] public teachers;
    string[] public courses;
    mapping(address => bool)  teacherExists;
    string public version;
    address admin;
    uint256 schoolRecordIndex;
    Color color;


    struct SchoolRecord{
        string subject;
        address professor;
        address student;
        uint256 grade;
        uint256 credits;  //per point
        bool mandatorySubmit;
        bool graded;
        bool submitted;
        bool late;
        string resourceIPFS;
        //dates
        uint timeOpened;
        uint submitDeadline;
        uint lastUpdated;
        bool exists;
    }

    mapping(uint256 => SchoolRecord) schoolRecords;
    mapping(address => uint256[]) studentRecords;
    mapping(string => mapping(address => uint256)) positionInSchoolRecord;
    mapping(address => uint256[]) recordsAssignedByTeacher;
    //mapping(address => mapping(string => uint256[])) recordsAssignedByTeacher;

    //mapping(string => uint) courses;


    event TeacherRegistered(address teacher);
    event SchoolRecordCreated(uint256 id, address teacher, string subject);
    event SchoolRecordSubmited(address student, string subject, string resourceURL);
    event SubmissionRemoved(address student, string subject);
    event SchoolRecordGraded(uint256 id, address teacher, string subject, string resourceURL);


    constructor(string memory _version){
        admin = msg.sender;
        version = _version;
        schoolRecordIndex = 0;
    }

      function getAdmin() public view  returns (address){
        //for test purposes only; delete from final form of contract
        return admin;
    }

    function addTeacher(address _teacher) public{
        require(msg.sender == admin && !teacherExists[_teacher]);

        //push the address into the teachers array, and set teacherExists to true for the teacher
        teachers.push(_teacher);
        teacherExists[_teacher] = true;    

        emit TeacherRegistered(_teacher);    
    }

    function addSchoolRecord(string memory _subject, address _student, bool _mandatorySubmit, uint256 _credits, uint256 deadLine) public returns(uint256){
        require(teacherExists[msg.sender], "Only teachers can create records!");


        //increment the schoolRecordIndex and initialize a new SchoolRecord from the array
        schoolRecordIndex++;
        SchoolRecord storage record = schoolRecords[schoolRecordIndex];


        //fill the record with data
        record.subject = _subject;
        record.professor = msg.sender;
        record.student = _student;
        record.credits = _credits;
        record.exists = true;
        record.graded = false;
        record.mandatorySubmit = _mandatorySubmit;
        if(_mandatorySubmit == false){
        record.submitted = true;
        }
        else
        {
        record.submitted = false;
        }
        record.late=false;
        record.timeOpened = block.timestamp;
        record.submitDeadline = deadLine;

        //store record index for student
        studentRecords[_student].push(schoolRecordIndex);
        positionInSchoolRecord[_subject][_student] = schoolRecordIndex;

        //store record index for teacher
        recordsAssignedByTeacher[msg.sender].push(schoolRecordIndex);
        courses.push(_subject);

        //emit event and return the schoolRecordIndex
        emit SchoolRecordCreated(schoolRecordIndex, msg.sender, _subject);
        return schoolRecordIndex;
    }

    function submitSchoolRecord(address _student, string memory _subject, string memory _resourceURL)public returns(uint256){
        //init record and check if it exists and it is assignet to the student who submits it.
        SchoolRecord storage record = schoolRecords[positionInSchoolRecord[_subject][_student]];
        require(record.exists, "Record not found!");
        require(record.student == msg.sender);
        //require to check if deadline is met;

        record.resourceIPFS = _resourceURL;
        record.submitted = true;

        if(record.submitDeadline > block.timestamp){
        record.late=true;
        }
        record.lastUpdated = block.timestamp;
        emit SchoolRecordSubmited(msg.sender, record.subject, _resourceURL);
        return block.timestamp;
    }

     function removeSubmission(address _student, string memory _subject)public returns(uint256){
        //init record and check if it exists and it is assignet to the student who submits it.
        SchoolRecord storage record = schoolRecords[positionInSchoolRecord[_subject][_student]];
        require(record.exists, "Record not found!");
        require(record.student == msg.sender);
        //require to check if deadline is met;

        record.resourceIPFS = "";
        record.submitted = false;
        record.lastUpdated = block.timestamp;
        emit SubmissionRemoved(msg.sender, record.subject);
        return block.timestamp;
    }

    function gradeSchoolRecord(string memory _subject, address _student, uint _grade)public{
        uint index = positionInSchoolRecord[_subject][_student];
        SchoolRecord storage record = schoolRecords[index];
        require(record.exists, "Record not found!");
        require(record.mandatorySubmit && bytes(record.resourceIPFS).length != 0, "student has not yet finished asignment!");
        require(record.professor == msg.sender, "you cannot grade this assignment!");
        record.grade = _grade;
        record.graded = true;
        record.lastUpdated = block.timestamp;

        //some logic for sending grade * credits tokens to student;
        //return record._grade * record._credits;

        emit SchoolRecordGraded(index, msg.sender, record.subject, record.resourceIPFS);
    }

    function getRecordOfStudent(string memory _subject, address _student) public view returns(SchoolRecord memory){
        uint index = positionInSchoolRecord[_subject][_student];

        //return a particular record of a student, based on a subject
        SchoolRecord storage record = schoolRecords[index];
        return record;
    }

     function getAllRecordsOfStudent(address _student) public view returns(SchoolRecord[] memory){
         SchoolRecord[] memory recordsOfStudent=  new SchoolRecord[](studentRecords[_student].length);
       for(uint256 i = 0; i < studentRecords[_student].length; i++){
           recordsOfStudent[i]=schoolRecords[studentRecords[_student][i]];
       }
        return recordsOfStudent;
    }

     function getAllRecordsOfTeacher(address _teacher) public view returns(SchoolRecord[] memory){
         SchoolRecord[] memory recordsOfTeacher = new SchoolRecord[](recordsAssignedByTeacher[_teacher].length);
        
        for(uint256 i = 0; i <recordsAssignedByTeacher[_teacher].length; i++){
            recordsOfTeacher[i] = schoolRecords[recordsAssignedByTeacher[_teacher][i]];
            }
        
        return recordsOfTeacher;
     }
    
    function isTeacher() public view returns(bool){
        return teacherExists[msg.sender];
    }
    function addColor(string memory _color) public{
        color.mint(_color);
    }

    
}