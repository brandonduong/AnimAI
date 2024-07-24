package com.example.demo.models;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@Document(collection = "Anime")
@NoArgsConstructor
@AllArgsConstructor
public class Anime {
  @Id
  private AnimeId id;

  private String oneLiner;
  private String summary;
  private String malId; // MyAnimeList ID
  private Integer realVotes;
  private Integer aiVotes;

  // Only used in case get API rate limit
  private String type;
  private Integer year;
  private Double score;
  private Integer members;
  private List<String> genres;
  private String name;
  private Integer episodes;
  private String imgUrl; // Only for real

  private List<Integer> scores; // List of size 20 counting number of times it was rated from 0.5 to 10

  private Boolean fake;

  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  public static class AnimeId {
    // Composite key / index
    private String date;
    private String mode; // anime, rating, or lightnovel
  }
}
