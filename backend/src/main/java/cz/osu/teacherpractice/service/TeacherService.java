package cz.osu.teacherpractice.service;

import cz.osu.teacherpractice.domain.PracticeDomain;
import cz.osu.teacherpractice.dto.request.NewPracticeDto;
import cz.osu.teacherpractice.dto.response.ReviewDto;
import cz.osu.teacherpractice.dto.response.StudentPracticeDto;
import cz.osu.teacherpractice.exception.ServerErrorException;
import cz.osu.teacherpractice.exception.UserErrorException;
import cz.osu.teacherpractice.mapper.MapStructMapper;
import cz.osu.teacherpractice.model.Practice;
import cz.osu.teacherpractice.model.Review;
import cz.osu.teacherpractice.model.Role;
import cz.osu.teacherpractice.model.User;
import cz.osu.teacherpractice.repository.PracticeRepository;
import cz.osu.teacherpractice.repository.ReviewRepository;
import cz.osu.teacherpractice.repository.SubjectRepository;
import cz.osu.teacherpractice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service @RequiredArgsConstructor
public class TeacherService {

    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;
    private final PracticeRepository practiceRepository;
    private final ReviewRepository reviewRepository;
    private final MapStructMapper mapper;

    private final UserService userService;

    public void addPractice(String teacherUsername, NewPracticeDto newPracticeDto) {
        User teacher = userRepository.findByEmail(teacherUsername).orElseThrow(() -> new ServerErrorException(
                "Učitel '" + teacherUsername + "' nenalezen."
        ));

        subjectRepository.findById(newPracticeDto.getSubject().getId()).orElseThrow(() -> new UserErrorException(
                "Předmět '" + newPracticeDto.getSubject().getName() + "' nenalezen.",
                "subject.id"
        ));

        Practice practice = mapper.newPracticeDtoToPractice(newPracticeDto);
        practice.setTeacher(teacher);
        practiceRepository.save(practice);
    }
    public List<StudentPracticeDto> getPracticesList(String teacherUsername, LocalDate date, Long subjectId, Pageable pageable) {
        User teacher = userRepository.findByEmail(teacherUsername).orElseThrow(() -> new ServerErrorException(
                "Učitel '" + teacherUsername + "' nenalezen."
        ));
        Long teacherId = teacher.getId();

        List<Practice> practices = practiceRepository.findAllByParamsAsListByTeacher(date, subjectId, teacherId, pageable);
        //sort practices by date
        practices.sort((p1, p2) -> p1.getDate().compareTo(p2.getDate()));
        List<PracticeDomain> practicesDomain = mapper.practicesToPracticesDomain(practices);

        List<PracticeDomain> toDelete = new ArrayList<>();

        practicesDomain.forEach(p -> {
            p.setNumberOfReservedStudents();
            p.setStudentNames(getStudentNamesByPractice(p, pageable));
            p.setFileNames(userService.getTeacherFiles(p.getTeacher().getUsername()));
            p.setStudentEmails(getStudentEmailsByPractice(p, pageable));
            toDelete.add(p);
        });

        for (PracticeDomain practiceDomain : toDelete) {
            if (practiceDomain.removeNotPassedPractices()) {
                practicesDomain.remove(practiceDomain);
            }
        }

        return mapper.practicesDomainToStudentPracticesDto(practicesDomain);
    }

    public List<StudentPracticeDto> getPracticesListPast(String teacherUsername, LocalDate date, Long subjectId, Pageable pageable) {
        User teacher = userRepository.findByEmail(teacherUsername).orElseThrow(() -> new ServerErrorException(
                "Učitel '" + teacherUsername + "' nenalezen."
        ));
        Long teacherId = teacher.getId();
        List<Practice> practices = practiceRepository.findAllByParamsAsListByTeacher(date, subjectId, teacherId, pageable);
        //sort practices by date
        practices.sort((p1, p2) -> p1.getDate().compareTo(p2.getDate()));

        List<PracticeDomain> practicesDomain = mapper.practicesToPracticesDomain(practices);
        List<PracticeDomain> toDelete = new ArrayList<>();

        practicesDomain.forEach(p -> {
            p.setNumberOfReservedStudents();
            p.setStudentNames(getStudentNamesByPractice(p, pageable));
            p.setFileNames(userService.getTeacherFiles(p.getTeacher().getUsername()));
            p.setStudentEmails(getStudentEmailsByPractice(p, pageable));
            String report = userService.getPracticeReport(p.getId());
            p.setReport(report);
            toDelete.add(p);
        });

        for (PracticeDomain practiceDomain : toDelete) {
            if (practiceDomain.removePassedPractices()) {
                practicesDomain.remove(practiceDomain);
            }
        }
        return mapper.practicesDomainToStudentPracticesDto(practicesDomain);
    }

    public List<String> getStudentNamesByPractice(PracticeDomain p, Pageable pageable) {
        List<Long> ids = userRepository.findAllStudentIdsByStudentPracticeIds(p.getId(), pageable);
        List<String> names = new ArrayList<>();
        for (Long id : ids) {
            User u = userRepository.findUserById(id);
            String name = u.getFirstName() + " " + u.getSecondName();
            names.add(name);
        }

        String[] arr = new String[names.size()];
        arr = names.toArray(arr);

        Arrays.sort(arr, new Comparator<String>() {
            public int compare(String str1, String str2) {
                String[] temp1 = str1.split(" ");
                String substr1 = temp1[temp1.length-1];
                String[] temp2 = str2.split(" ");
                String substr2 = temp2[temp2.length-1];

                return substr2.compareTo(substr1);
            }
        });

        return new ArrayList<>(Arrays.asList(arr));
    }

    public List<String> getStudentEmailsByPractice(PracticeDomain p, Pageable pageable){
        List<Long> ids = userRepository.findAllStudentIdsByStudentPracticeIds(p.getId(), pageable);
        List<String> emails = new ArrayList<>();
        for(Long id: ids){
            User u = userRepository.findUserById(id);
            String email = u.getUsername();
            emails.add(email);
        }
        String[] arr = new String[emails.size()];
        arr = emails.toArray(arr);

        Arrays.sort(arr, new Comparator<String>() {
            public int compare(String str1, String str2) {
                String substr1 = userRepository.findByEmail(str1).get().getSecondName();
                String substr2 = userRepository.findByEmail(str2).get().getSecondName();

                return substr2.compareTo(substr1);
            }
        });

        return new ArrayList<>(Arrays.asList(arr));
    }
}
