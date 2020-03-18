package pl.mbalcer.chat.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.mbalcer.chat.model.Ban;

@Repository
public interface BanRepository extends JpaRepository<Ban, Long> {
}
