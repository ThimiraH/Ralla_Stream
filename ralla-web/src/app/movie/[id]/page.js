"use client";

import React, { useState, useEffect, use, useRef } from 'react';
import VideoPlayer from '@/components/VideoPlayer';
import MovieRow from '@/components/MovieRow';
import Spinner from '@/components/Spinner';
import DiscussionSection from '@/components/DiscussionSection';
import MovieHeader from '@/components/MovieHeader';
import EpisodeList from '@/components/EpisodeList';
import InfoTabs from '@/components/InfoTabs';
import TrendingSidebar from '@/components/TrendingSidebar';
import RecentlyWatched from '@/components/RecentlyWatched';
import EpisodeHistory from '@/components/EpisodHistory';
import { HandThumbUpIcon, ShareIcon, ArrowDownTrayIcon, EyeIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import { HandThumbUpIcon as HandThumbUpSolid } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";

export default function MoviePage({ params }) {
    const { id } = use(params);

    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedMovies, setRelatedMovies] = useState([]);
    const [sources, setSources] = useState([]);
    const [currentSubtitles, setCurrentSubtitles] = useState([]);
    const [currentSeason, setCurrentSeason] = useState(0);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [currentViews, setCurrentViews] = useState(0);

    const { data: session } = useSession(); // Session එක ගන්න
    // ... existings states
    const [isLiked, setIsLiked] = useState(false); //Like State එක
    const [likesCount, setLikesCount] = useState(0);

    const viewCountedRef = useRef(false);

    const incrementView = async (movieId, type, seasonNum = null, episodeNum = null) => {
        try {
            await fetch(`/api/movies/${movieId}/view`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, seasonNumber: seasonNum, episodeNumber: episodeNum })
            });
        } catch (err) { console.error("View count error", err); }
    };

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const res = await fetch(`/api/movies/${id}`);
                const data = await res.json();

                if (data.success) {
                    const movieData = data.data;
                    setMovie(movieData);
                    setIsLiked(data.data.hasLiked);

                    // Related Movies
                    if (movieData.category) {
                        const relatedRes = await fetch(`/api/movies?category=${movieData.category}&limit=10`);
                        const relatedData = await relatedRes.json();
                        if (relatedData.success) {
                            setRelatedMovies(relatedData.data.filter(m => m._id !== movieData._id).map(m => ({ id: m._id, name: m.title, image: m.thumbnailUrl, year: m.year })));
                        }
                    }

                    // Initial Setup
                    if (movieData.type === "movie") {
                        if (movieData.videoSources?.length > 0) setSources(movieData.videoSources);
                        else setSources([{ quality: "Auto", url: movieData.videoUrl }]);
                        setCurrentSubtitles(movieData.subtitles || []);
                        setCurrentViews(movieData.views || 0);
                        setLikesCount(movieData.likedBy?.length || 0);

                        // Check if User Liked
                        if (session) {
                            const uid = session.user.id || session.user._id;
                            setIsLiked(movieData.likedBy?.includes(uid));
                        }

                    } else if (movieData.type === "series" && movieData.seasons.length > 0) {
                        const firstEp = movieData.seasons[0]?.episodes[0];
                        if (firstEp) {
                            if (firstEp.videoSources?.length > 0) setSources(firstEp.videoSources);
                            else setSources([{ quality: "Auto", url: firstEp.videoUrl }]);
                            setCurrentSubtitles(firstEp.subtitles || []);
                            setCurrentViews(firstEp.views || 0);
                            setLikesCount(firstEp.likedBy?.length || 0);

                            if (session) {
                                const uid = session.user.id || session.user._id;
                                setIsLiked(firstEp.likedBy?.includes(uid));
                            }

                        }
                    }
                }
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchMovie();
    }, [id, session]);

    // 1. Handle Share Function
    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard! 🔗");
    };

    // 2. Handle Download Function
    const handleDownload = () => {
        // දැනට play වන video source එක ගන්න
        const currentVideoUrl = sources[0]?.url;
        if (currentVideoUrl) {
            // අලුත් tab එකක open කරනවා (Direct download browser settings මත රඳා පවති)
            window.open(currentVideoUrl, '_blank');
            toast.success("Download starting...");
        } else {
            toast.error("Download link unavailable");
        }
    };

    // 3. Handle Like Function
    const handleLike = async () => {
        if (!session) { toast.error("Please login to like!"); return; }

        // Optimistic UI Update (Click කළ ගමන් වෙනස් වෙනවා)
        const prevLiked = isLiked;
        const prevCount = likesCount;

        setIsLiked(!isLiked);
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1);

        try {
            // Prepare Data
            let bodyData = { type: 'movie' };

            if (movie.type === 'series') {
                const sData = movie.seasons[currentSeason];
                const eData = sData?.episodes[currentEpisodeIndex];
                if (sData && eData) {
                    bodyData = {
                        type: 'series',
                        seasonNumber: sData.seasonNumber,
                        episodeNumber: eData.episodeNumber
                    };
                }
            }

            const res = await fetch(`/api/movies/${movie._id}/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData) // Send Season & Episode info
            });

            const data = await res.json();
            if (!data.success) {
                // Error නම් Revert කරන්න
                setIsLiked(prevLiked);
                setLikesCount(prevCount);
                toast.error("Failed to like");
            } else {
                // Server එකෙන් එන හරියටම ගාණ දාන්න (Optional)
                setLikesCount(data.likesCount);
            }

        } catch (err) {
            setIsLiked(prevLiked);
            setLikesCount(prevCount);
        }
    };

    const handleVideoPlay = () => {
        if (!movie || viewCountedRef.current) return;
        viewCountedRef.current = true;

        if (movie.type === 'movie') {
            incrementView(movie._id, 'movie');
            setCurrentViews(prev => prev + 1);
        } else if (movie.type === 'series') {
            const sData = movie.seasons[currentSeason];
            const eData = sData?.episodes?.[currentEpisodeIndex];
            if (sData && eData) {
                incrementView(movie._id, 'series', sData.seasonNumber, eData.episodeNumber);
                setCurrentViews(prev => prev + 1);
            }
        }
    };

    const handleEpisodeSelect = (episodeIndex, seasonIndex = currentSeason) => {
        if (!movie || !movie.seasons) return;

        const currentSeasonData = movie.seasons[seasonIndex];
        if (!currentSeasonData) return;
        const selectedEp = currentSeasonData.episodes?.[episodeIndex];
        if (!selectedEp) return;

        setCurrentEpisodeIndex(episodeIndex);
        if (seasonIndex !== currentSeason) setCurrentSeason(seasonIndex);

        if (session) {
            const uid = session.user.id || session.user._id;
            setIsLiked(selectedEp.likedBy?.includes(uid));
        } else {
            setIsLiked(false);
        }

        if (selectedEp.videoSources?.length > 0) setSources(selectedEp.videoSources);
        else setSources([{ quality: "Auto", url: selectedEp.videoUrl }]);

        setCurrentSubtitles(selectedEp.subtitles || []);
        setCurrentViews(selectedEp.views || 0);
        setLikesCount(selectedEp.likedBy?.length || 0);
        incrementView(movie._id, 'series', currentSeasonData.seasonNumber, selectedEp.episodeNumber);
        viewCountedRef.current = false;

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // 👇 එකම එක Save Function එකයි තියෙන්නේ (මේකෙන් ඔක්කොම වැඩ කරනවා)
    const handleVideoProgress = ({ currentTime, duration }) => {
        if (!movie || duration === 0) return;
        if (currentTime < 5) return;

        const isSeries = movie.type === "series" || (movie.seasons && movie.seasons.length > 0);

        let uniqueKey = movie._id;
        let episodeInfo = "";
        let sNum = null, epNum = null;

        if (isSeries) {
            const sData = movie.seasons[currentSeason];
            const epData = sData?.episodes[currentEpisodeIndex];
            if (!sData || !epData) return;

            sNum = sData.seasonNumber;
            epNum = epData.episodeNumber;

            // 👇 Unique Key එක (ID + Season + Episode)
            uniqueKey = `${movie._id}_S${sNum}_E${epNum}`;

            // 👇 Title Format (Title Only)
            episodeInfo = epData.title && epData.title.trim() !== "" ? epData.title : `Episode ${epNum}`;
        }

        const secondsLeft = duration - currentTime;
        const progressPercent = (currentTime / duration) * 100;
        const isFinished = progressPercent > 90;

        const historyItem = {
            uniqueKey,
            id: movie._id,
            title: movie.title,
            image: movie.thumbnailUrl,
            type: isSeries ? "series" : "movie",
            seasonNumber: sNum,
            episodeNumber: epNum,
            episodeIndex: isSeries ? currentEpisodeIndex : null,
            seasonIndex: isSeries ? currentSeason : null,
            lastWatched: {
                episodeText: episodeInfo,
                timeLeft: Math.floor(secondsLeft / 60),
                progressPercent: progressPercent,
                isFinished: isFinished,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            },
            timestamp: Date.now()
        };

        const existingHistory = JSON.parse(localStorage.getItem('ralla_history') || '[]');

        // 👇 එකම Episode එකේ පරණ record එක විතරක් අයින් කරනවා (Unique Key එකෙන්)
        const filtered = existingHistory.filter(h => h.uniqueKey !== uniqueKey);

        // අලුත් එක උඩින්ම දානවා
        const updated = [historyItem, ...filtered].slice(0, 100);
        localStorage.setItem('ralla_history', JSON.stringify(updated));
    };

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><Spinner /></div>;
    if (!movie) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Movie not found!</div>;

    const isSeries = movie.type === "series";
    const activeEpisode = isSeries ? movie.seasons?.[currentSeason]?.episodes?.[currentEpisodeIndex] : null;
    const displayTitle = isSeries
        ? `${movie.title} - ${activeEpisode?.title || 'Episode ' + (activeEpisode?.episodeNumber || 0)}`
        : movie.title;
    const displayDate = new Date(movie.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });


    let currentSeasonNum = null;
    let currentEpisodeNum = null;

    if (movie.type === 'series' && movie.seasons) {
        const sData = movie.seasons[currentSeason]; // currentSeason කියන්නේ index එක (0, 1, 2)
        if (sData) {
            currentSeasonNum = sData.seasonNumber; // DB එකේ තියෙන නියම අංකය
            const epData = sData.episodes[currentEpisodeIndex];
            if (epData) {
                currentEpisodeNum = epData.episodeNumber;
            }
        }
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white pb-20">
            <div className="pt-20"><MovieHeader movie={movie} /></div>

            <div className="max-w-[1700px] mx-auto px-4 md:px-8 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3 space-y-8">
                        <div>
                            <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800 relative z-0">
                                <VideoPlayer
                                    key={sources[0]?.url}
                                    sources={sources}
                                    subtitles={currentSubtitles}
                                    poster={movie.thumbnailUrl}

                                    // මෙන්න මෙතන තමයි ප්‍රධාන වෙනස. එක function එකක් විතරයි යවන්නේ.
                                    onProgress={handleVideoProgress}

                                    onPlayStart={handleVideoPlay}
                                />
                            </div>

                            <div className="mt-4 border-b border-gray-800 pb-4">
                                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">{displayTitle}</h2>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 text-gray-400 text-sm">
                                        <span>Uploaded on {displayDate}</span>
                                        <span className="flex items-center gap-1 text-gray-300">
                                            <EyeIcon className="w-4 h-4 text-blue-500" />
                                            {currentViews.toLocaleString()} Views
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">

                                        <ActionButton
                                            icon={isLiked ? <HandThumbUpSolid className="w-5 h-5 text-blue-500" /> : <HandThumbUpIcon className="w-5 h-5" />}
                                            text={`${likesCount} Likes`}
                                            onClick={handleLike}
                                            active={isLiked}
                                        />

                                        <ActionButton
                                            icon={<ShareIcon className="w-5 h-5" />}
                                            text="Share"
                                            onClick={handleShare}
                                        />
                                        <ActionButton
                                            icon={<ArrowDownTrayIcon className="w-5 h-5" />}
                                            text="Download"
                                            onClick={handleDownload}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <DiscussionSection
                            movieId={movie._id}
                            season={currentSeasonNum}
                            episode={currentEpisodeNum}
                        />

                        {relatedMovies.length > 0 && (
                            <div className="pt-6 border-t border-gray-800">
                                <h3 className="text-xl font-bold mb-4 text-white">You may also like</h3>
                                <MovieRow title="" movies={relatedMovies} />
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        {isSeries && (
                            <EpisodeHistory
                                currentMovieId={movie._id}
                                onPlayEpisode={(sIndex, eIndex) => {
                                    handleEpisodeSelect(eIndex, sIndex);
                                }}
                            />
                        )}

                        {isSeries && (
                            <EpisodeList
                                episodes={movie.seasons[currentSeason].episodes}
                                currentEpisodeIndex={currentEpisodeIndex}
                                onEpisodeSelect={handleEpisodeSelect}
                            />
                        )}

                        <RecentlyWatched />
                        <InfoTabs description={movie.description} cast={movie.cast || []} />
                        <TrendingSidebar />
                    </div>
                </div>
            </div>
        </div>
    );
}

function ActionButton({ icon, text, onClick }) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#252525] border border-gray-700 px-4 py-2 rounded-full text-sm font-bold transition-all text-white active:scale-95"
        >
            {icon}
            <span>{text}</span>
        </button>
    );
}