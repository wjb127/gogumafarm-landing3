// .hot-card 요소에 마우스 오버 시 썸네일 미리보기 이미지를 띄우는 기능
// 각 .hot-card 요소에 대해 반복
document.querySelectorAll(".hot-card").forEach((anchor) => {
  let preview = null;

  anchor.addEventListener("mouseenter", (e) => {
    // 마우스가 .hot-card에 들어오면 내부 이미지(.cl-element-featured_media__image)를 찾아서
    // 이미 미리보기(preview)가 있으면 제거 후 새로 생성하여 body에 고정 위치로 띄움
    const thumbnailImg = anchor.querySelector(
      ".cl-element-featured_media__image"
    );
    if (thumbnailImg) {
      // 이미 있으면 제거
      if (preview) preview.remove();

      // 새로 생성
      preview = document.createElement("img");
      preview.className = "hover-thumbnail";
      preview.src = thumbnailImg.src;
      preview.style.position = "fixed";
      preview.style.display = "block";
      preview.style.zIndex = "9999";
      preview.style.pointerEvents = "none"; // 마우스 이벤트 방지

      document.body.appendChild(preview);
    }
  });

  anchor.addEventListener("mousemove", (e) => {
    // 마우스가 움직일 때마다 미리보기 이미지를 마우스 근처로 이동
    if (preview) {
      const offset = 20;
      preview.style.left = `${e.clientX + offset}px`;
      preview.style.top = `${e.clientY + offset}px`;
    }
  });

  anchor.addEventListener("mouseleave", () => {
    // 마우스가 .hot-card에서 나가면 미리보기 이미지를 제거
    if (preview) {
      preview.remove();
      preview = null;
    }
  });
});

jQuery(document).ready(function ($) {
  // 모바일 메뉴(햄버거) 클릭 시 모바일 내비게이션 토글
  $(".menu-mo").on("click", function () {
    if ($(".nav-mo").is(":visible")) {
      $(".nav-mo").fadeOut(150);
    } else {
      $(".nav-mo").fadeIn(150);
    }
  });
  $(".nav-close").on("click", function () {
    $(".nav-mo").fadeOut(150);
  });

  // 서브메뉴 토글 버튼 클릭 시 하위 메뉴 열고 닫기
  $(".sub-trigger").on("click", function (e) {
    e.preventDefault();
    $(this).closest(".has-sub").toggleClass("open");
  });

  // 정렬 드롭다운 토글 (정렬 옵션 열고 닫기)
  $(".sort-dropdown .sort-current").on("click", function (e) {
    e.preventDefault();
    const $dropdown = $(this).closest(".sort-dropdown");
    const $options = $dropdown.find(".sort-options");
    $options.toggle();
    $dropdown.toggleClass("open", $options.is(":visible"));
  });

  // 드롭다운 외부 클릭 시 드롭다운 닫기
  $(document).on("click", function (e) {
    if (!$(e.target).closest(".sort-dropdown").length) {
      $(".sort-options").hide();
      $(".sort-dropdown").removeClass("open");
    }
  });

  // 검색 아이콘 클릭 시 검색 모달 열기
  $(".header-search").on("click", function (e) {
    e.preventDefault();
    $(".modal-search").fadeIn(150);
    $(".modal-search input").focus();
  });
  $(".modal-search-close").on("click", function (e) {
    e.preventDefault();
    $(".modal-search").fadeOut(150);
  });
  $(document).on("keydown", function (e) {
    if (e.key === "Escape" || e.keyCode === 27) {
      $(".modal-search").fadeOut(150);
    }
  });

  // 모달 바깥 영역 클릭 시 검색 모달 닫기
  $(document).on("click", ".modal-search", function (e) {
    if (!$(e.target).closest(".modal-content").length) {
      $(".modal-search").fadeOut(150);
    }
  });

  // modal-close 버튼 클릭 시 모달 숨기기
  $(document).on("click", ".modal-close", function (e) {
    e.preventDefault();
    $(this).closest(".modal").fadeOut(150);
    $(this).closest(".modal").removeClass("open");
  });

  // modal-week 버튼 클릭 시 1주간 모달 숨기기
  $(document).on("click", ".modal-week", function (e) {
    e.preventDefault();
    const modal = $(this).closest(".modal");
    const modalId = modal.attr("id") || "default-modal";

    // 1주일 후의 날짜 계산 (7일)
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

    // 쿠키에 숨김 정보 저장 (7일 만료)
    document.cookie = `modal-hidden-${modalId}=true; expires=${oneWeekFromNow.toUTCString()}; path=/`;

    // 모달 숨기기
    modal.fadeOut(150);
    modal.removeClass("open");
  });

  // 쿠키에서 값을 가져오는 헬퍼 함수
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  }

  // 페이지 로드 시 모달 숨김 상태 확인
  function checkModalVisibility() {
    $(".modal").each(function () {
      const modal = $(this);
      const modalId = modal.attr("id") || "default-modal";
      const isHidden = getCookie(`modal-hidden-${modalId}`);

      if (isHidden === "true") {
        modal.css("display", "none");
        modal.removeClass("open");
      } else {
        modal.css("display", "flex");
        modal.addClass("open");
      }
    });
  }

  // 페이지 로드 시 모달 상태 확인
  checkModalVisibility();

  // 스크롤 시 헤더 배경 처리 (스크롤 시 흰 배경, 맨 위면 투명)
  function toggleHeaderBg() {
    let $header = $(".wp-site-blocks > header.wp-block-template-part");
    let $whiteHeader = $(".white-header");
    if ($(window).scrollTop() > 0) {
      $header.css("background", "#fff");
      $whiteHeader.removeClass("white");
    } else {
      $header.css("background", "");
      $whiteHeader.addClass("white");
    }
  }
  $(window).on("scroll", toggleHeaderBg);
  $(document).ready(toggleHeaderBg);

  // 페이지 로드시 헤더 배경 초기화
  // .footer-goguma-wrap 클릭 시 /subscribe로 이동
  $(document).on("click", ".footer-goguma-wrap", function () {
    window.location.href = "/subscribe";
  });

  // 협업 문의 버튼 클릭 시 폼 전환(협업 폼 표시, 기타 폼 숨김)
  $(".co-oper").on("click", function () {
    $(this).addClass("selected");
    $(".other").removeClass("selected");
    // 애니메이션으로 show/hide
    $("#fluentform_7").fadeIn(300);
    $("#fluentform_6").hide();
  });

  // 기타 문의 버튼 클릭 시 폼 전환(기타 폼 표시, 협업 폼 숨김)
  $(".other").on("click", function () {
    $(this).addClass("selected");
    $(".co-oper").removeClass("selected");
    $("#fluentform_7").hide();
    $("#fluentform_6").fadeIn(300);
  });

  // 현재 페이지 URL 저장
  const currentHref = window.location.href;

  // 카카오톡 공유 버튼 클릭 시 카카오톡 공유 API 호출
  $(".kakao-share").click(() => {
    Kakao.init("4a10d83874c58e4bdd277bcb5dfd8e9c");
    const title = $(".wp-block-post-title").text();
    const description = $('meta[property="og:description"]').attr("content");
    const imageUrl = $('meta[property="og:image"]').attr("content");

    Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: title,
        description: description,
        imageUrl: imageUrl,
        link: {
          mobileWebUrl: currentHref,
          webUrl: currentHref,
        },
      },
      buttons: [
        {
          title: "자세히 보기",
          link: {
            mobileWebUrl: currentHref,
            webUrl: currentHref,
          },
        },
      ],
    });
  });

  // 링크 복사 버튼 클릭 시 현재 주소 클립보드 복사
  $(".link-share").click(() => {
    //https에서만 작동
    window.navigator.clipboard
      .writeText(currentHref)
      .then(() => alert("주소가 복사되었습니다"));
  });

  // 페이스북 공유 버튼 클릭 시 새 창으로 공유
  $(".facebook-share").click(() => {
    window.open(
      "http://www.facebook.com/sharer/sharer.php?u=" + currentHref,
      ""
    );
  });

  // 트위터 공유 버튼 클릭 시 새 창으로 공유
  $(".twitter-share").click(() => {
    const titletext = $(".wp-block-post-title").text();
    window.open(
      "https://twitter.com/intent/tweet?text=" +
        titletext +
        "&url=" +
        currentHref,
      ""
    );
  });

  // 소셜 아이콘 클릭 시 소셜 리스트 토글
  $(".article-social").on("click", function (e) {
    e.preventDefault();
    $(".social-list").fadeToggle(150);
  });

  // filter_cat 파라미터에 따라 버튼 자동 선택 (이제 PHP에서 처리)
  const urlParams = new URLSearchParams(window.location.search);
  const catMap = {
    "filter-news": [5],
    "filter-feed": [202],
    "filter-goguma": [389, 384, 385],
    // 필요시 추가
  };

  // 카테고리 필터 버튼 클릭 시 filter_cat 파라미터만 변경하여 새로고침
  $(document).on(
    "click",
    ".filter-news, .filter-feed, .filter-goguma",
    function (e) {
      e.preventDefault();
      $(this).toggleClass("selected"); // 시각적 피드백(즉시 반영, 새로고침 시 PHP가 최종 결정)
      const selectedCats = [];
      $(
        ".filter-news.selected, .filter-feed.selected, .filter-goguma.selected"
      ).each(function () {
        $.each(
          catMap,
          function (cls, catVal) {
            if ($(this).hasClass(cls)) {
              // 배열의 모든 값을 추가
              selectedCats.push(...catVal);
            }
          }.bind(this)
        );
      });

      const url = new URL(window.location.href);
      if (selectedCats.length > 0) {
        url.searchParams.set("filter_cat", selectedCats.join(","));
      } else {
        url.searchParams.delete("filter_cat");
      }
      window.location.href = url.toString();
    }
  );
  if ($(".toc").is(":empty")) {
    // 목차가 비어있으면 목차 컨테이너 숨김
    $(".toc-container").hide();
  }
});

// Swiper 슬라이더 초기화 (Q&A 섹션 등에서 사용)
// 반응형으로 슬라이드 개수, 모드, 간격 등 설정
const swiper = new Swiper(".q-section .swiper", {
  speed: 400, // 슬라이드 전환 속도(ms)
  slidesPerView: 3, // 기본 슬라이드 개수
  spaceBetween: 20, // 슬라이드 간 간격(px)
  autoHeight: true, // 슬라이드 높이 자동 조정
  breakpoints: {
    0: {
      freeMode: {
        enabled: true, // 모바일에서 자유 스크롤
      },
      slidesPerView: 1.33, // 모바일에서 슬라이드 개수
    },
    769: {
      slidesPerView: 2, // 태블릿
    },
    901: {
      slidesPerView: 2.5, // 데스크탑 중간
    },
    1201: {
      slidesPerView: 3, // 데스크탑
    },
  },
});
