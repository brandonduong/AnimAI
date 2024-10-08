package com.example.demo.controllers;

import java.time.Instant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.AnimeAnswerDTO;
import com.example.demo.dto.AnimeVoteRequest;
import com.example.demo.dto.TitleHiddenDTO;
import com.example.demo.dto.VotesDTO;
import com.example.demo.services.TitleService;
import com.example.demo.validation.NotFutureDate;

@RestController
@CrossOrigin
@RequestMapping("/api/title")
@Validated
public class TitleController {
  @Autowired
  private TitleService titleService;

  @GetMapping("/{date}")
  public TitleHiddenDTO getTitleByDate(@PathVariable @NotFutureDate String date) {
    return titleService.getTitleByDate(date);
  }

  @PatchMapping("/{date}")
  public AnimeAnswerDTO voteTitleByDate(@PathVariable @NotFutureDate String date,
      @RequestBody @Validated AnimeVoteRequest vote) {
    return titleService.voteTitleByDate(date, vote);
  }

  @GetMapping("/stats/{date}")
  public VotesDTO getTitleStatsByDate(@PathVariable @NotFutureDate String date) {
    return titleService.getTitleStatsByDate(date);
  }
}
