package cz.osu.teacherpractice.service.fileManagement;

import cz.osu.teacherpractice.model.User;
import cz.osu.teacherpractice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
@RequiredArgsConstructor
public class FileService {

    private final UserRepository userRepository;

    public Boolean deleteFile(String email, String fileName){
        long teacherId = userRepository.findByEmail(email).get().getId();
        File myObj = new File(FileUtil.folderPath + teacherId + "/" + fileName);
        return myObj.delete();
    }

    public String figureOutFileNameFor(String teacherMail, String fileName){
        User teacher = userRepository.findByEmail(teacherMail).get();
        return FileUtil.folderPath + teacher.getId() + "/" + fileName;
    }

    public String figureOutReportNameFor(Long id){
        return FileUtil.reportsFolderPath + "/" + id;
    }
}
