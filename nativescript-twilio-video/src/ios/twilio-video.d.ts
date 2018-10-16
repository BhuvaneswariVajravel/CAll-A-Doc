import { Observable } from 'tns-core-modules/data/observable';
import { VideoActivityBase } from "../twilio-common";
export declare class VideoActivity implements VideoActivityBase {
    private TWILIO_ACCESS_TOKEN;
    previousAudioMode: any;
    localVideoView: any;
    remoteVideoView: any;
    localVideoTrack: any;
    localAudioTrack: any;
    cameraCapturer: any;
    accessToken: string;
    room: string;
    participantIdentity: string;
    previousMicrophoneMute: boolean;
    localParticipant: any;
    audioManager: any;
    name: string;
    videoEvent: Observable;
    private _roomListener;
    private _participantListener;
    private roomDelegate;
    private participantDelegate;
    private participant;
    constructor();
    connect_to_room(roomName: string): void;
    configureAudio(): void;
    removeParticipantVideo(): void;
    participantListener(): void;
    removeParticipant(): void;
    addParticipantVideo(): void;
    addParticipant(): void;
    set_access_token(token: string, name: string): void;
    disconnect_from_room(): void;
    roomListener(): void;
    createAudioAndVideoTracks(): void;
    toggle_local_video(): void;
    toggle_local_audio(): void;
    destroy_local_video(): void;
    destroy_local_audio(): void;
}
